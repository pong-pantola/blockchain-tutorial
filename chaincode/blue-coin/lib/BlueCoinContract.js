/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const shim = require('fabric-shim');

class BlueCoinContract extends Contract {
  async initLedger(ctx){
    console.info('============= START : Initialize Ledger =============');

    console.info('============= END : Initialize Ledger =============');

  }

  bytesToJson(bytes){
    if (bytes == null || bytes.length === 0)
      return null;
    
    return JSON.parse(bytes.toString())
  }

  jsonToBytes(json){
    if (json == null)
      return null;

    return Buffer.from(JSON.stringify(json));
  }

  async getState(ctx, key){
    const bytes = await ctx.stub.getState(key);
    return this.bytesToJson(bytes);
  }

  async putState(ctx, key, json){
    await ctx.stub.putState(key, this.jsonToBytes(json));
  }

  async generateInitialCoin(ctx, userId) {
    console.info('============= START : Generate Initial Coin =============');
    let json = await this.getState(ctx, userId);
  
    //check if organization has already generated blue coins before
    if (json != null)
      return shim.error("User " + userId + " has generated already initial blue coins before.  User can generate blue coins only once.")

    json = {
      amt: 500
    }

    let result = {
      User: userId,
      Amount: json.amt
  }

    await this.putState(ctx, userId, json);

    console.info('============= END : Generate Initial Coin =============');
//    return shim.success("Successfully generated " + json.amt + " blue coins for " + userId);
    return shim.success({"status" :"success","message":"Successfully generated blue coins","result": result });
  }

  async getBalance(ctx, userId) {
    console.info('============= START : Get Balance =============');    
    const json = await this.getState(ctx, userId);
 

    if (json == null)
     return shim.error("User " + userId + " has no record in the system.  Run generateInitialCoin first to get initial coins.")

    let result = {
     User: userId,
     Amount: json.amt
    }

    console.info('============= END : Get Balance =============');    
//    return shim.success(json);  
    return shim.success({"status" :"success","message":"Getting Balance successfull","result": result });
  }  

  async transferCoin(ctx, sourceUserId, destUserId, amount){
    console.info('============= START : TRANSFER COIN =============');
    const srcBCOINJson = await this.getState(ctx, sourceUserId);
    if (srcBCOINJson == null)
      return shim.error("Source enrollment UserId does not exist: " + sourceUserId);

    const dstBCOINJson = await this.getState(ctx, destUserId);
    if (dstBCOINJson == null)
      return shim.error("Destination enrollment UserId does not exist: " + destUserId);

    if (srcBCOINJson.amt >= amount) {
      srcBCOINJson.amt -= parseInt(amount);
      dstBCOINJson.amt += parseInt(amount);
 
      await this.putState(ctx, sourceUserId, srcBCOINJson);
      await this.putState(ctx, destUserId, dstBCOINJson);
    }else{
      return shim.error("Insufficient fund for Source UserId: " + sourceUserId + '; ' + "Available balance: " + srcBCOINJson.amt + '; ' + "Amount to Transfer: " + amount)
    }

    console.info('============= END : TRANSFER COIN =============');
    return shim.success("Transferred successfully the amount of " + amount + " blue coins from " + sourceUserId + " to " + destUserId);
  }

}

module.exports = BlueCoinContract;