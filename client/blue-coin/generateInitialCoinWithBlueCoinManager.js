const BlueCoinManager = require("../../manager/blue-coin/BlueCoinManager.js")

async function main(orgIndex, userIndex, mspId){
  const config = require(`./config/config-org${orgIndex}.json`)
  const bcMgr = new BlueCoinManager(config);

  const response = await bcMgr.generateInitialCoin([mspId], `user${userIndex}`, 
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
  console.log("Syntax : node generateInitialCoinWithBlueCoinManager.js <org index> <user index> <mspId>")
  console.log("Example: node generateInitialCoinWithBlueCoinManager.js 1 2 Org1MSP")
}else{
  main(process.argv[2], process.argv[3], process.argv[4])
}
