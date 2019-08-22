'use strict';

const { Contract } = require('fabric-contract-api');
//const shim = require('fabric-shim');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const Utility = require("./Utility.js");

class BlueCoinContract extends Contract {

  async init(ctx){
    console.info('============= START : Init =============');

    console.info('============= END : Init =============');

  }

  async generateInitialCoin(ctx, mspId) {
    console.info('============= START : Generate Initial Coin =============');

    if (!Utility.assertMspId(ctx, mspId))
      throw new Error("The parameter mspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));

    let key = mspId + '-initial';
    let json = await Utility.getState(ctx, key);
  
    //check if organization has already generated blue coins before
    if (json != null)
      throw new Error("Organization " + mspId + " has generated already initial blue coins before.  Organization can generate blue coins only once.")

    json = {
      mspId: mspId,
      amt: 500,
      spent: false
    }

    await Utility.putState(ctx, key, json);

    console.info('============= END : Generate Initial Coin =============');
    return {"status" : 200, "message" : "Successfully generated blue coins", "payload" : json };
  }

  async getBalance(ctx, mspId) {
    console.info('============= START : Get Balance =============');    

    if (!Utility.assertMspId(ctx, mspId))
      throw new Error("The parameter mspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));

    let key = mspId + '-initial';
    let json = await Utility.getState(ctx, key);
    
    //checking if organization is already in the system
    if (json == null)
      throw new Error("Organization " + mspId + " has no record in the system.  Run generateInitialCoin first to get initial coins.")
  
    const jsonQuerySrc = {
      "selector": {
        "$and": [
          {
              "mspId": {"$eq": mspId}
          },
          {
              "spent": {"$eq": false}
          }
        ]
      }
    }

    let queryResultSrc = await Utility.getQueryResult(ctx, jsonQuerySrc);
    var totalBalance = 0;
    if(queryResultSrc.length > 0){
      for (let element of queryResultSrc){
        if (element.Record.amt > 0)
          totalBalance += parseInt(element.Record.amt);
      }
    }else
      throw new Error(mspId + " has NO available balance.");

    console.info('============= END : Get Balance =============');    

    return {"status" : 200, "message" : "Total Balance retrieved successfully for " + mspId + " : " + totalBalance};
  }  

  async transferCoin(ctx, srcMspId, dstMspId, serialNo, amount){
    console.info('============= START : TRANSFER COIN =============');
    var amtTrans = 0;
    if (!Utility.assertMspId(ctx, srcMspId))
      throw new Error("The parameter srcMspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));

    const jsonQuerySrc = {
        "selector": {
          "$and": [
            {
                "mspId": {"$eq": srcMspId}
            },
            {
                "spent": {"$eq": false}
            }
          ]
        }
    }

    amtTrans = parseInt(amount);
    var totBalance = 0;
    let done = false;
    let queryResultSrc = await Utility.getQueryResult(ctx, jsonQuerySrc);
    if(queryResultSrc.length > 0){
      for (let element of queryResultSrc){
        if(!done){
          var amtTemp = 0;
          if (parseInt(amount) <= 0)
            throw new Error("Transfer Amount should be greater than 0.");

          totBalance += parseInt(element.Record.amt);
          element.Record.amt -= amtTrans;
          amtTrans = element.Record.amt;
          amtTemp = element.Record.amt;

          var key = element.Key;
          var srcBCOINJson = await Utility.getState(ctx, key);
          srcBCOINJson.spent = true;
          await Utility.putState(ctx, key, srcBCOINJson);
          
          if (amtTrans < 0){
            amtTrans = Math.abs(amtTrans);
          }else{
            done = true;
            if (amtTrans > 0){
              let changeFrmKey = srcMspId + '-change-from-' + dstMspId + '-' + serialNo;
              const srcJson = await Utility.getState(ctx, changeFrmKey);
              if (srcJson == null)
                await Utility.putState(ctx, changeFrmKey,{mspId: srcMspId, amt: amtTrans,spent: false});
              else
                throw new Error("Record already exist: " + changeFrmKey);
            }
            let frmKey = dstMspId + '-from-' + srcMspId + '-' + serialNo;
            const dstJson = await Utility.getState(ctx, frmKey);
            if (dstJson == null)
              await Utility.putState(ctx, frmKey,{mspId: dstMspId, amt: amount,spent: false});
            else
              throw new Error("Record already exist: " + frmKey);
          }
        }
      }
    }else
      throw new Error(srcMspId + ' no available amount to transfer.');

    if (amtTemp < 0){
      throw new Error("Insufficient fund for Source MspId: " + srcMspId + '; ' + "Available balance: " + totBalance + '; ' + "Amount to Transfer: " + amount);
    }
    console.info('============= END : TRANSFER COIN =============');
    return {"status" : 200, "message" : "Transferred successfully the amount of " + amount + " blue coins from " + srcMspId + " to " + dstMspId, "payload" : ""};
  }

  async getAllAbove(ctx, val) {
    console.info('============= START : GET ALL ABOVE =============');

    const jsonQuery = {
      "selector": {
        "mspId": {"$gt": parseInt(val)}  
      }
    }

    let queryResult = await Utility.getQueryResult(ctx, jsonQuery);

    console.info('============= END : GET ALL ABOVE =============');    
    return {"status" : 200, "message" : "Getting records above " + val + " blue coin", "payload" : queryResult};
  }

  async getRecords(ctx, mspId) {
    console.info('============= START : GET ALL ABOVE =============');

    const jsonQuery = {
      "selector": {
        "mspId": mspId
      }
    }

    let queryResult = await Utility.getQueryResult(ctx, jsonQuery);

    console.info('============= END : GET ALL ABOVE =============');    
    return {"status" : 200, "message" : "Getting records of " + mspId + " blue coin", "payload" : queryResult};
  }

  async getTransactionHistory(ctx, mspId){
    console.info('============= START : GET TRANSACTION HISTORY =============');

    if (!Utility.assertMspId(ctx, mspId))
      throw new Error("The parameter mspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));
    
    let result = {}
    //insert code here

    console.info('============= END : GET TRANSACTION HISTORY =============');
    return {"status" : 200, "message" : "Getting transaction history of " + mspId, "payload" : result};
  }
}

module.exports = BlueCoinContract;