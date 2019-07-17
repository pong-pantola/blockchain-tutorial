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

  async generateInitialCoin(ctx, orgId) {
    console.info('============= START : Generate Initial Coin =============');
    const amtAsBytes = await ctx.stub.getState(orgId);

    //check if organization has already generated blue coins before
    if (amtAsBytes != null)
      return shim.error("Organization " + orgId + " has generated already initial blue coins before.  Organization can generate blue coins only once.")

    const amt = 500;
    await ctx.stub.putState(orgId, Buffer.from(JSON.stringify(amt)));


    console.info('============= END : Generate Initial Coin =============');
    return shim.success("Successfully generated " + amt + " blue coins for " + orgId);
  }

}

module.exports = BlueCoinContract;
                 