'use strict';

const { Contract } = require('fabric-contract-api');
const Utility = require("./Utility.js");

class BlueCoinContract extends Contract {

  async init(ctx){
    console.info('============= START : Init =============');
    let json = await Utility.getState(ctx, "initMarker");
    
    if (json != null)
      throw new Error("Function init can only be called once.")    

    //place needed world state initialization here  

    json = {
      marker: "init"
    }

    await Utility.putState(ctx, "initMarker", json);

    console.info('============= END : Init =============');
    return {status: 200, message:"Successfully initialized world state", payload: json };        
  }


  async generateInitialCoin(ctx, mspId) {
    console.info('============= START : Generate Initial Coin =============');

    let json = await Utility.getState(ctx, mspId);
  
    //check if organization has already generated blue coins before
    if (json != null)
      throw new Error("Organization " + mspId + " has generated already initial blue coins before.  Organization can generate blue coins only once.")

    json = {
      mspId: mspId,
      amt: 500
    }

    await Utility.putState(ctx, mspId, json);

    console.info('============= END : Generate Initial Coin =============');
    return {status: 200, message:"Successfully generated blue coins", payload: json };
  }

  async getBalance(ctx, mspId) {
    console.info('============= START : Get Balance =============');    

    const json = await Utility.getState(ctx, mspId);

    if (json == null)
     throw new Error("Organization " + mspId + " has no record in the system.  Run generateInitialCoin first to get initial coins.")

    console.info('============= END : Get Balance =============');    

    return {status : 200, message:"Balance retrieved successfully", payload: json};
  }  

  async transferCoin(ctx, srcMspId, dstMspId, amount){
    console.info('============= START : TRANSFER COIN =============');

    const srcBCOINJson = await Utility.getState(ctx, srcMspId);
    if (srcBCOINJson == null)
      throw new Error("Source mspId does not exist: " + srcMspId);

    const dstBCOINJson = await Utility.getState(ctx, dstMspId);
    if (dstBCOINJson == null)
      throw new Error("Destination mspId does not exist: " + dstMspId);

    if (srcBCOINJson.amt >= amount) {
      srcBCOINJson.amt -= parseInt(amount);
      dstBCOINJson.amt += parseInt(amount);
 
      await Utility.putState(ctx, srcMspId, srcBCOINJson);
      await Utility.putState(ctx, dstMspId, dstBCOINJson);
    }else{
      throw new Error("Insufficient fund for Source MspId: " + srcMspId + '; ' + "Available balance: " + srcBCOINJson.amt + '; ' + "Amount to Transfer: " + amount)
    }

    console.info('============= END : TRANSFER COIN =============');
    return {status : 200, message:"Transferred successfully the amount of " + amount + " blue coins from " + srcMspId + " to " + dstMspId, payload: {}};
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
    return {status: 200, message: "Getting records above " + val + " blue coin",payload: queryResult};
  }

  async getTransactionHistory(ctx, mspId){
    console.info('============= START : GET TRANSACTION HISTORY =============');

    const result = await Utility.getTransactionHistory(ctx, mspId);
    console.info('============= END : GET TRANSACTION HISTORY =============');
    return {status:200, message: "Getting transaction history of " + mspId, payload: result};
  }

}

module.exports = BlueCoinContract;