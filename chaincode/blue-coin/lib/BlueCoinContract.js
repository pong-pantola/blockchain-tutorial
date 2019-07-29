'use strict';

const { Contract } = require('fabric-contract-api');
const shim = require('fabric-shim');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const Utility = require("./Utility.js");

class BlueCoinContract extends Contract {

  async init(ctx){
    console.info('============= START : Init =============');

    console.info('============= END : Init =============');

  }

  async generateInitialCoin(ctx, mspId) {
    console.info('============= START : Generate Initial Coin =============');
    let json = await Utility.getState(ctx, mspId);
  
    //check if organization has already generated blue coins before
    if (json != null)
      return shim.error("User " + mspId + " has generated already initial blue coins before.  User can generate blue coins only once.")

    json = {
      mspId: mspId,
      amt: 500
    }

    await Utility.putState(ctx, mspId, json);

    console.info('============= END : Generate Initial Coin =============');
    return shim.success({"status" :"success","message":"Successfully generated blue coins","result": json });
  }

  async getBalance(ctx, mspId) {
    console.info('============= START : Get Balance =============');    

    let cid = new ClientIdentity(ctx.stub);
    console.log("getID():"+cid.getID())
    console.log("getMSPID():"+cid.getMSPID())
    console.log("getAttributeValue('role'):"+cid.getAttributeValue('role'))
    console.log("getAttributeValue('affiliation'):"+cid.getAttributeValue('affiliation'))
    console.log("getAttributeValue('enrollmentID'):"+cid.getAttributeValue('enrollmentID'))

    
    const json = await Utility.getState(ctx, mspId);
 

    if (json == null)
     return shim.error("User " + mspId + " has no record in the system.  Run generateInitialCoin first to get initial coins.")

    console.info('============= END : Get Balance =============');    

    return shim.success({"status" :"success","message":"Getting Balance successfully","result": json });
  }  

  async transferCoin(ctx, srcUserId, dstUserId, amount){
    console.info('============= START : TRANSFER COIN =============');
    const srcBCOINJson = await Utility.getState(ctx, srcUserId);
    if (srcBCOINJson == null)
      return shim.error("Source mspId does not exist: " + srcUserId);

    const dstBCOINJson = await Utility.getState(ctx, dstUserId);
    if (dstBCOINJson == null)
      return shim.error("Destination mspId does not exist: " + dstUserId);

    if (srcBCOINJson.amt >= amount) {
      srcBCOINJson.amt -= parseInt(amount);
      dstBCOINJson.amt += parseInt(amount);
 
      await Utility.putState(ctx, srcUserId, srcBCOINJson);
      await Utility.putState(ctx, dstUserId, dstBCOINJson);
    }else{
      return shim.error("Insufficient fund for Source UserId: " + srcUserId + '; ' + "Available balance: " + srcBCOINJson.amt + '; ' + "Amount to Transfer: " + amount)
    }

    console.info('============= END : TRANSFER COIN =============');
    return shim.success("Transferred successfully the amount of " + amount + " blue coins from " + srcUserId + " to " + dstUserId);
  }


  async getAllAbove(ctx, val) {
    console.info('============= START : GET ALL ABOVE =============');
    const jsonQuery = {
      "selector": {
        "amt": {"$gt": parseInt(val)}  
      }
    }

    let queryResult = await Utility.getQueryResult(ctx, jsonQuery);

    console.info('============= END : GET ALL ABOVE =============');    
    return shim.success({"status" :"success","message":"Getting records above " + val + " blue coin","result": queryResult });
  }

  async getTransactionHistory(ctx, mspId){
    console.info('============= START : GET TRANSACTION HISTORY =============');
    const result = Utility.getTransactionHistory(ctx, mspId);
    console.info('============= END : GET TRANSACTION HISTORY =============');
    return shim.success({"status" :"success","message":"Getting transaction history of " + mspId,"result": result });
  }

  

  async getHistoryForMarble(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }
    let marbleName = args[0];
    console.info('- start getHistoryForMarble: %s\n', marbleName);

    let resultsIterator = await stub.getHistoryForKey(marbleName);
    let method = thisClass['getAllResults'];
    let results = await method(resultsIterator, true);

    return Buffer.from(JSON.stringify(results));
  }

  async getHistoryForMarble(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }
    let marbleName = args[0];
    console.info('- start getHistoryForMarble: %s\n', marbleName);

    let resultsIterator = await stub.getHistoryForKey(marbleName);
    let method = thisClass['getAllResults'];
    let results = await method(resultsIterator, true);

    return Buffer.from(JSON.stringify(results));
  }

}

module.exports = BlueCoinContract;