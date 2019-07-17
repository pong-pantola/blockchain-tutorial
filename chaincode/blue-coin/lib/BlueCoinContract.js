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
    const amtAsBytes = await ctx.stub.getState(userId);

    //check if organization has already generated blue coins before
    if (amtAsBytes != null)
      return shim.error("Organization " + userId + " has generated already initial blue coins before.  Organization can generate blue coins only once.")

    const amt = 500;
    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(amt)));


    console.info('============= END : Generate Initial Coin =============');
    return shim.success("Successfully generated " + amt + " blue coins for " + userId);
  }

}

module.exports = BlueCoinContract;
                 