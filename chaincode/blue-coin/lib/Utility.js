'use strict';

class Utility{
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

  static async getQueryResult(ctx, jsonQuery) {
    console.info('============= START : GET QUERY RESULT =============');
    console.info("jsonQuery: " + JSON.stringify(jsonQuery, null, 4));

    let strQuery = JSON.stringify(jsonQuery);
    let resultIterator = await ctx.stub.getQueryResult(strQuery);

    let resultArr = await Utility.iteratorToArrayResult(resultIterator, false);

    console.info('============= END : GET QUERY RESULT =============');
    return resultArr;
  }
  
  static async iteratorToArrayResult(iterator, isHistory) {
    console.info('============= START : Iterator to Array Result =============');
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

          for(let key in jsonRes)
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
        console.info('============= END : Iterator to Array Result =============');
        return arr;
      }
    }
  }
}


module.exports = Utility;