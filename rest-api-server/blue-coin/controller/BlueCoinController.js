let controller = {}

controller.generateInitialCoin = async(req, res, next) => {
  const userId = req.params.userId
  const mspId = req.params.mspId
  const response = await req.app.locals.bcMgr.generateInitialCoin([mspId], userId, 
    function(err, txId, status, blockNo){
      if (err)
        console.err(err);
      else{
        console.log("generateInitialCoin invocation successful.")
        console.log(`Invoked by ${userId}.`)
        console.log(`txId: ${txId}  status: ${status}  blockNo: ${blockNo}`)
      }
    }
  )    
  res.status(200).send(response)
}

controller.getBalance = async(req, res, next) => {
  const userId = req.params.userId
  const mspId = req.params.mspId
  const response = await req.app.locals.bcMgr.getBalance([mspId], userId)    
  res.status(200).send(response)
}

controller.transferCoin = async(req, res, next) => {
  const userId = req.params.userId
  const srcMspId = req.body.srcMspId
  const dstMspId = req.body.dstMspId
  const amt = req.body.amt
  
  const response = await req.app.locals.bcMgr.transferCoin([srcMspId, dstMspId, amt], userId, 
    function(err, txId, status, blockNo){
      if (err)
        console.err(err);
      else{
        console.log("transferCoin invocation successful.")
        console.log(`Invoked by ${userId}.`)
        console.log(`txId: ${txId}  status: ${status}  blockNo: ${blockNo}`)
      }
    }
  )    
  res.status(200).send(response)
}

controller.getTransactionHistory = async(req, res, next) => {
  const userId = req.params.userId
  const mspId = req.params.mspId
  const response = await req.app.locals.bcMgr.getTransactionHistory([mspId], userId)    
  res.status(200).send(response)
}

module.exports = controller