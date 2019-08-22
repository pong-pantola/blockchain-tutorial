const BlueCoinManager = require("../../manager/blue-coin-utxo/BlueCoinManager.js")

async function main(orgIndex, userIndex, srcMspId, dstMspId, serialNo, amt){
  const config = require(`./config/config-org${orgIndex}.json`)
  const bcMgr = new BlueCoinManager(config);

  const response = await bcMgr.transferCoin([srcMspId, dstMspId, serialNo, amt], `user${userIndex}`, 
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


if (process.argv.length != 8){
  console.log("Syntax : node transferCoinWithBlueCoinManager.js <org index> <user index> <srcMspId> <dstMspId> <serialNo> <amt>")
  console.log("Example: node transferCoinWithBlueCoinManager.js 1 2 Org1MSP Org2MSP 11111 210")
}else{
  main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7])
}
