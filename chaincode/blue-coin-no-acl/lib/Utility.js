'use strict';

const ClientIdentity = require('fabric-shim').ClientIdentity;

class Utility{

  static getMspId(ctx){
    const cid = new ClientIdentity(ctx.stub);
    return cid.getMSPID();
  }

  static assertMspId(ctx, mspId){
    const cid = new ClientIdentity(ctx.stub);
    return mspId == cid.getMSPID();
  }

  static bytesToJson(bytes){
    if (bytes == null || bytes.length === 0)
      return null;
    
    return JSON.parse(bytes.toString())
  }

  static jsonToBytes(json){
    if (json == null)
      return null;

    return Buffer.from(JSON.stringify(json));
  }

  static async getState(ctx, key){
    const bytes = await ctx.stub.getState(key);
    return this.bytesToJson(bytes);
  }

  static async putState(ctx, key, json){
    await ctx.stub.putState(key, this.jsonToBytes(json));
  }

  static async getPrivateData(ctx, collectionName, key){
    const bytes = await ctx.stub.getPrivateData(collectionName, key);
    return this.bytesToJson(bytes);
  }

  static async putPrivateData(ctx, collectionName, key, json){
    await ctx.stub.putPrivateData(collectionName, key, this.jsonToBytes(json));
  }

  static async getQueryResult(ctx, jsonQuery) {
    console.info('============= UTILITY START : GET QUERY RESULT =============');
    console.info("jsonQuery: " + JSON.stringify(jsonQuery, null, 4));

    let strQuery = JSON.stringify(jsonQuery);
    let resultIterator = await ctx.stub.getQueryResult(strQuery);

    let resultArr = await Utility.iteratorToArrayResult(resultIterator, false);

    console.info('============= UTILITY END : GET QUERY RESULT =============');
    return resultArr;
  }

  static async getTransactionHistory(ctx, key) {
    console.info('============= UTILITY START : GET TRANSACTION HISTORY =============');

    let resultIterator = await ctx.stub.getHistoryForKey(key);

    let resultArr = await Utility.iteratorToArrayResult(resultIterator, true);

    console.info('============= UTILITY END : GET TRANSACTION HISTORY =============');
    return resultArr;
  }  

  static async iteratorToArrayResult(iterator, isHistory) {
    console.info('============= UTILITY START : Iterator to Array Result =============');
    let arr = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        //console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();

          for(let key in res.value)
            console.info("key:"+key)


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
        arr.push(jsonRes);
      }
      if (res.done) {
        await iterator.close();
        console.info("arr: "+JSON.stringify(arr, null, 4));
        console.info('============= UTILITY END : Iterator to Array Result =============');
        return arr;
      }
    }
  }
}


module.exports = Utility;