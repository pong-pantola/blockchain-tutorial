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

  async generateInitialCoin(ctx, userId) {
    console.info('============= START : Generate Initial Coin =============');
    const jsonAsBytes = await ctx.stub.getState(userId);

    //check if organization has already generated blue coins before
    if (jsonAsBytes != null && jsonAsBytes.length !== 0)
      return shim.error("User " + userId + " has generated already initial blue coins before.  User can generate blue coins only once.")

    const json = {
      amt: 500
    }

    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(json)));


    console.info('============= END : Generate Initial Coin =============');
    return shim.success("Successfully generated " + amt + " blue coins for " + userId);
  }

  async getBalance(ctx, userId) {
    console.info('============= START : Get Balance =============');    
    const jsonAsBytes = await ctx.stub.getState(userId);

    if (jsonAsBytes == null || jsonAsBytes.length === 0) {
      return shim.error("User " + userId + " has no coins.  Run generateInitialCoin first to get initial coins.")
    }

    console.info('============= END : Get Balance =============');    
    return shim.success(jsonAsBytes.toString());  
  }
}

module.exports = BlueCoinContract;
                 