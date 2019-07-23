/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const shim = require('fabric-shim');

class BlueCoinContract extends Contract {

  async init(ctx){
    console.info('============= START : Init =============');

    console.info('============= END : Init =============');

  }

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
      userId: userId,
      amt: 500
    }

    await this.putState(ctx, userId, json);

    console.info('============= END : Generate Initial Coin =============');
    return shim.success({"status" :"success","message":"Successfully generated blue coins","result": json });
  }

  async getBalance(ctx, userId) {
    console.info('============= START : Get Balance =============');    
    const json = await this.getState(ctx, userId);
 

    if (json == null)
     return shim.error("User " + userId + " has no record in the system.  Run generateInitialCoin first to get initial coins.")

    console.info('============= END : Get Balance =============');    

    return shim.success({"status" :"success","message":"Getting Balance successfully","result": json });
  }  

  async transferCoin(ctx, srcUserId, dstUserId, amount){
    console.info('============= START : TRANSFER COIN =============');
    const srcBCOINJson = await this.getState(ctx, srcUserId);
    if (srcBCOINJson == null)
      return shim.error("Source userId does not exist: " + srcUserId);

    const dstBCOINJson = await this.getState(ctx, dstUserId);
    if (dstBCOINJson == null)
      return shim.error("Destination userId does not exist: " + dstUserId);

    if (srcBCOINJson.amt >= amount) {
      srcBCOINJson.amt -= parseInt(amount);
      dstBCOINJson.amt += parseInt(amount);
 
      await this.putState(ctx, srcUserId, srcBCOINJson);
      await this.putState(ctx, dstUserId, dstBCOINJson);
    }else{
      return shim.error("Insufficient fund for Source UserId: " + srcUserId + '; ' + "Available balance: " + srcBCOINJson.amt + '; ' + "Amount to Transfer: " + amount)
    }

    console.info('============= END : TRANSFER COIN =============');
    return shim.success("Transferred successfully the amount of " + amount + " blue coins from " + srcUserId + " to " + dstUserId);
  }


  async getAllAbove(ctx, val) {
    
    let jsonQuery = {
      "selector": {
        "amt": {"$gt": parseInt(val)}  
      }
    }

    let queryResult = await this.getQueryResultg(ctx, jsonQuery);
    return shim.success({"status" :"success","message":"Getting records above " + val + " blue coin","result": queryResult });
  }

  async getQueryResult(ctx, jsonQuery) {
    console.info('============= START : GET QUERY RESULT =============');
    console.info("jsonQuery: " + JSON.stringify(jsonQuery, null, 4));

    let strQuery = JSON.stringify(jsonQuery);
    let iteratorResult = await ctx.stub.getQueryResult(strQuery);

    let result = await this.iteratorToArrayResult(iteratorResult, false);

    console.info('============= END : GET QUERY RESULT =============');
    return result;
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

  async iteratorToArray(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }
}

module.exports = BlueCoinContract;