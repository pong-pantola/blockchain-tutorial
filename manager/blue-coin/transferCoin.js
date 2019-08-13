const BlueCoinManager = require("./BlueCoinManager.js")

async function main(orgIndex, userIndex, srcMspId, dstMspId, amt){
  const config = require(`./config/config-org${orgIndex}.json`)
  const bcMgr = new BlueCoinManager(config);

  const response = await bcMgr.transferCoin([srcMspId, dstMspId, amt], `user${userIndex}`, 
    function(err, txId, status, blockNo){
      if (err)
        console.err(err);
      else{
        console.log("transferCoin invocation successful.")
        console.log(`Invoked by user${userIndex} of org${orgIndex}.`)
        console.log(`txId: ${txId}  status: ${status}  blockNo: ${blockNo}`)
      }
    }
  )

  console.log("response: " + JSON.stringify(response, null ,4))  
}


if (process.argv.length != 7){
  console.log("Syntax : node transferCoin.js <org index> <user index> <srcMspId> <dstMspId> <amt>")
  console.log("Example: node transferCoin.js 1 2 Org1MSP Org2MSP 210")
}else{
  main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6])
}
