//const TransactionManager = require("./TransactionManager.js")
process.env.HFC_LOGGING='{}'
//process.env.HFC_LOGGING='{"info":"console"}'

const { FileSystemWallet, Gateway } = require('fabric-network');

async function submitTransaction(config, param){

  let gateway;

  const connectionConfigFilePath = config.connectionConfigFilePath;
  const walletDirPath = config.walletDirPath;
  const connectionConfig = require(connectionConfigFilePath);  

  try{

    // Create a new file system based wallet for managing identities.
    const wallet = new FileSystemWallet(walletDirPath);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(param.userId);

    if (!userExists) {
      return {status: 500, message: "User " + param.userId + " does not exist in the wallet."};
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    await gateway.connect(connectionConfig, { wallet, identity: param.userId, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(param.channelName);

    // Get the contract from the network.
    const contract = network.getContract(param.contractName);

    let response;
    if (param.callback){
      const transaction = contract.createTransaction(param.funcName);
      //callback should have the following parameters: err, transactionId, status, blockNumber
      const listener = await transaction.addCommitListener(param.callback);

      if (param.transientMap)
        response = await transaction.setTransient(param.transientMap).submit(...param.argArr);
      else
        response = await transaction.submit(...param.argArr);
    }else{
      if (param.transientMap){
        const transaction = contract.createTransaction(param.funcName);
        response = await transaction.setTransient(param.transientMap).submit(...param.argArr);
      }else
        response = await contract.submitTransaction(param.funcName, ...param.argArr);
    }

    return JSON.parse(response.toString());
  }catch(error){
    return {status: 500, message: error.toString()};
  }finally{
    if (gateway)
      gateway.disconnect();
  }
}


async function generateInitialCoin(config, argArr, userId, callback){
  const param = {
    userId: userId, 
    channelName: "mychannel",
    contractName: "blue-coin", 
    funcName: "generateInitialCoin", 
    argArr: argArr,
    callback: callback
  }
  
  const response = await submitTransaction(config, param)

  return response
}

async function main(orgIndex, userIndex, mspId){
  const config = require(`./config/config-org${orgIndex}.json`)

  const response = await generateInitialCoin(config, [mspId], `user${userIndex}`, 
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
  console.log("Syntax : node generateInitialCoin.js <org index> <user index> <mspId>")
  console.log("Example: node generateInitialCoin.js 1 2 Org1MSP")
}else{
  main(process.argv[2], process.argv[3], process.argv[4])
}
