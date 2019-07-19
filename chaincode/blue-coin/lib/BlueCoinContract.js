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
    const bytes = await ctx.stub.getState(userId);
    return bytesToJson(bytes);
  }

  async putState(ctx, key, json){
    await ctx.stub.putState(key, jsonToBytes(json));
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

    await this.putState(ctx, userId, json);

    console.info('============= END : Generate Initial Coin =============');
    return shim.success("Successfully generated " + json.amt + " blue coins for " + userId);
  }

  async getBalance(ctx, userId) {
    console.info('============= START : Get Balance =============');    
    const json = await this.getState(ctx, userId);

    if (json != null)
      return shim.error("User " + userId + " has no coins.  Run generateInitialCoin first to get initial coins.")

    console.info('============= END : Get Balance =============');    
    return shim.success(json);  
  }  
  /*
  async generateInitialCoin(ctx, userId) {
    console.info('============= START : Generate Initial Coin =============');
    const jsonStrAstBytes = await ctx.stub.getState(userId);

    //check if organization has already generated blue coins before
    if (jsonStrAstBytes != null && jsonStrAstBytes.length !== 0)
      return shim.error("User " + userId + " has generated already initial blue coins before.  User can generate blue coins only once.")

    const json = {
      amt: 500
    }

    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(json)));


    console.info('============= END : Generate Initial Coin =============');
    return shim.success("Successfully generated " + json.amt + " blue coins for " + userId);
  }

  async getBalance(ctx, userId) {
    console.info('============= START : Get Balance =============');    
    const jsonStrAstBytes = await ctx.stub.getState(userId);

    if (jsonStrAstBytes == null || jsonStrAstBytes.length === 0) {
      return shim.error("User " + userId + " has no coins.  Run generateInitialCoin first to get initial coins.")
    }

    console.info('============= END : Get Balance =============');    
    return shim.success(jsonStrAstBytes.toString());  
  }
*/
}

module.exports = BlueCoinContract;
                 