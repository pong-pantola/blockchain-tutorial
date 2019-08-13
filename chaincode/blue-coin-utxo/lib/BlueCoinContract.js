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

    if (!Utility.assertMspId(ctx, mspId))
      return shim.error("The parameter mspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));

    let json = await Utility.getState(ctx, mspId);
  
    //check if organization has already generated blue coins before
    if (json != null)
      return shim.error("Organization " + mspId + " has generated already initial blue coins before.  Organization can generate blue coins only once.")

    json = {
      mspId: mspId,
      amt: 500
    }

    await Utility.putState(ctx, mspId, json);

    console.info('============= END : Generate Initial Coin =============');
    return shim.success({status: 200, message:"Successfully generated blue coins", payload: json });
  }

  async getBalance(ctx, mspId) {
    console.info('============= START : Get Balance =============');    

    if (!Utility.assertMspId(ctx, mspId))
      return shim.error("The parameter mspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));

    let cid = new ClientIdentity(ctx.stub);
    console.log("getID():"+cid.getID())
    console.log("getMSPID():"+cid.getMSPID())
    console.log("getAttributeValue('role'):"+cid.getAttributeValue('role'))
    console.log("getAttributeValue('affiliation'):"+cid.getAttributeValue('affiliation'))
    console.log("getAttributeValue('enrollmentID'):"+cid.getAttributeValue('enrollmentID'))

    
    const json = await Utility.getState(ctx, mspId);
 

    if (json == null)
     return shim.error("Organization " + mspId + " has no record in the system.  Run generateInitialCoin first to get initial coins.")

    console.info('============= END : Get Balance =============');    

    return shim.success({status : 200, message:"Balance retrieved successfully", payload: json});
  }  

  async transferCoin(ctx, srcMspId, dstMspId, amount){
    console.info('============= START : TRANSFER COIN =============');

    if (!Utility.assertMspId(ctx, srcMspId))
      return shim.error("The parameter srcMspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));


    const srcBCOINJson = await Utility.getState(ctx, srcMspId);
    if (srcBCOINJson == null)
      return shim.error("Source mspId does not exist: " + srcMspId);

    const dstBCOINJson = await Utility.getState(ctx, dstMspId);
    if (dstBCOINJson == null)
      return shim.error("Destination mspId does not exist: " + dstMspId);

    if (srcBCOINJson.amt >= amount) {
      srcBCOINJson.amt -= parseInt(amount);
      dstBCOINJson.amt += parseInt(amount);
 
      await Utility.putState(ctx, srcMspId, srcBCOINJson);
      await Utility.putState(ctx, dstMspId, dstBCOINJson);
    }else{
      return shim.error("Insufficient fund for Source MspId: " + srcMspId + '; ' + "Available balance: " + srcBCOINJson.amt + '; ' + "Amount to Transfer: " + amount)
    }

    console.info('============= END : TRANSFER COIN =============');
    return shim.success({status : 200, message:"Transferred successfully the amount of " + amount + " blue coins from " + srcMspId + " to " + dstMspId, payload: {}});
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
    return shim.success({status: 200, message: "Getting records above " + val + " blue coin",payload: queryResult});
  }

  async getTransactionHistory(ctx, mspId){
    console.info('============= START : GET TRANSACTION HISTORY =============');

    if (!Utility.assertMspId(ctx, mspId))
      return shim.error("The parameter mspId should be the same as the caller's mspId: " + Utility.getMspId(ctx));
    
    const result = await Utility.getTransactionHistory(ctx, mspId);
    console.info('============= END : GET TRANSACTION HISTORY =============');
    return shim.success({status:200, message: "Getting transaction history of " + mspId, payload: result});
  }

  async saveOrg1PrivateData(ctx, sharedData){
    console.info('============= START : Save Org1 Private Data =============');
    let sharedJson = {
      data: sharedData
    }
    //https://medium.com/beyondi/private-data-in-hyperledger-fabric-3aaa8a3994ed
    const secretData = ctx.stub.getTranscient();
    // convert into buffer
    var buffer = new Buffer(secretData.map.conversation.value.toArrayBuffer());// from buffer into string
    var JSONString = buffer.toString("utf8");// from json string into object
    var JSONObject = JSON.parse(JSONString);
    console.info("transcient data: "+JSON.stringify(JSONObject, null, 4))
    let secretJson = {
      data: JSONObject
    }

    await Utility.putState(ctx, "org1-shared-data", sharedJson)
    await Utility.putPrivateData(ctx, "org1-collection", "org1-secret-data", secretJson)
    
    console.info('============= END : Save Org1 Private Data =============');
  }

  async getOrg1PrivateData(ctx){
    console.info('============= START : Get Org1 Private Data =============');
    const sharedJson = await Utility.getState(ctx, "org1-shared-data");
    const secretJson = await Utility.getPrivateData(ctx, "org1-collection", "org1-secret-data");
    if (json == null)
     return shim.error("Org1 has No private data.")

    console.info('============= END : Get Org1 Private Data =============');    

    return shim.success({status : 200, message:"Private data of org1 retrieved successfully", payload: json});    
    console.info('============= END : Save Org1 Private Data =============');
  }
  

}

module.exports = BlueCoinContract;