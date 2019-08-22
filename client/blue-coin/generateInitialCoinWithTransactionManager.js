const TransactionManager = require("../../manager/transaction/TransactionManager.js")

async function generateInitialCoin(txMgr, argArr, userId, callback){
  const param = {
    userId: userId, 
    channelName: "mychannel",
    contractName: "blue-coin", 
    funcName: "generateInitialCoin", 
    argArr: argArr,
    callback: callback
  }
  
  const response = await txMgr.submitTransaction(param)

  return response
}

async function main(orgIndex, userIndex, mspId){
  const config = require(`./config/config-org${orgIndex}.json`)
  const txMgr = new TransactionManager(config);

  const response = await generateInitialCoin(txMgr, [mspId], `user${userIndex}`, 
    function(err, txId, status, blockNo){
      if (err)
        console.err(err);
      else{
        console.log("generateInitialCoin invocation successful.")
        console.log(`Invoked by user${userIndex} of org${orgIndex}.`)
        console.log(`txId: ${txId}  status: ${status}  blockNo: ${blockNo}`)
      }
    }
  )

  console.log("response: " + JSON.stringify(response, null ,4))  
}


if (process.argv.length != 5){
  console.log("Syntax : node generateInitialCoinWithTransactionManager.js <org index> <user index> <mspId>")
  console.log("Example: node generateInitialCoinWithTransactionManager.js 1 2 Org1MSP")
}else{
  main(process.argv[2], process.argv[3], process.argv[4])
}
