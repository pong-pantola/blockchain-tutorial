'use strict';



const { FileSystemWallet, Gateway } = require('fabric-network');



class TransactionManager{

  constructor(config){
    this.connectionConfigFilePath = config.connectionConfigFilePath;
    this.walletDirPath = config.walletDirPath;
    this.connectionConfig = require(this.connectionConfigFilePath);
  }

  async queryTransaction(param){
    let gateway;

    try{
      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(param.userId);

      if (!userExists) {
        throw Error("User " + param.userId + " does not exist in the wallet.");
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();

      //await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
      await gateway.connect(this.connectionConfig, { wallet, identity: param.userId, discovery: { enabled: false } });

      const client = gateway.getClient();

      let peerUrl;

      //if param.peerName is not specified, get the first peer in the connection profile
      if (!param.peerName && this.connectionConfig.peers){
        let keyArr = Object.keys(this.connectionConfig.peers)
        if (keyArr.length > 0)
          param.peerName = keyArr[0];
      }

      if (this.connectionConfig.peers &&
          this.connectionConfig.peers[param.peerName] &&
          this.connectionConfig.peers[param.peerName].url)
        peerUrl = this.connectionConfig.peers[param.peerName].url;
      else
        throw Error("Cannot find URL of peer " + param.peerName + " in connection profile.");

      const peer = client.newPeer(peerUrl);
      const channel = client.newChannel(param.channelName);

      const pTx = await channel.queryTransaction(param.txId, peer)

      const txDetail = pTx.transactionEnvelope.payload.data.actions[0];
      const payload = txDetail.payload;
    
      const argArr = payload.chaincode_proposal_payload.input.chaincode_spec.input.args;
    
      const detail = {};
      detail.argArr = [];

      let first = true;
      for(let arg of argArr){
        if (first){
          detail.funcName = arg.toString();
          first = false;
        }
        else
          detail.argArr.push(arg.toString())
      }
    
      return detail;
    }catch(error){
      throw error;

    }finally{

      if (gateway)

        gateway.disconnect();

    }
  }

  async submitTransaction(param){

    let gateway;

    try{

      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(param.userId);

      if (!userExists) {
        throw Error("User " + param.userId + " does not exist in the wallet.");
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();

      await gateway.connect(this.connectionConfig, { wallet, identity: param.userId, discovery: { enabled: false } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(param.channelName);

      // Get the contract from the network.
      const contract = network.getContract(param.contractName);

      let response;
      if (param.callback){
        const transaction = contract.createTransaction(param.funcName);
        //callback should have the following parameters: err, transactionId, status, blockNumber
        const listener = await transaction.addCommitListener(param.callback);
        response = await transaction.submit(...param.argArr);
      }else
        response = await contract.submitTransaction(param.funcName, ...param.argArr);

      return JSON.parse(response.toString());
    }catch(error){
      throw error;
    }finally{
      if (gateway)
        gateway.disconnect();
    }
  }


}





module.exports = TransactionManager;

/*

function func(x, y, z){

  console.log("x:"+x)

  console.log("y:"+y)

  console.log("z:"+z)



}



function main(a, ...b){

  console.log("a:"+a);

  console.log("b:"+JSON.stringify(b))

  func(...b);



}



main(1, 2, 3, 4)

*/



async function main(){

  const config = require("./config/config.json")

  const txMgr = new TransactionManager(config)

  //const response = await txMgr.submitTransaction("user1", "mychannel", "blue-coin", "generateInitialCoin", "user1");
/*  const response = await txMgr.submitTransaction({
      userId: "user1", 
      channelName: "mychannel", 
      contractName: "blue-coin", 
      funcName: "generateInitialCoin", 
      argArr: ["user1"]
    });
*/
  //console.log("response:"+response);



  let response

  //response = await txMgr.submitTransaction("user1", "mychannel", "blue-coin", "getBalance", "Org1MSP");

  //console.log("response:"+JSON.stringify(response, null, 4));

  response = await txMgr.submitTransaction({
    userId: "user1", 
    channelName: "mychannel",
    //peerName: "peer0.org1.example.com", 
    contractName: "blue-coin", 
    funcName: "transferCoin", 
    argArr: ["Org1MSP", "Org2MSP", "1"],
    callback: function(err, txId, status, blockNo){
                if (err)
                  console.err(err);
                else
                  console.log(`txId: ${txId}  status: ${status}  blockNo: ${blockNo}`)
              }
  });  
console.log("response:"+JSON.stringify(response, null, 4));

/*
  response = await txMgr.submitTransaction({
      userId: "user1", 
      channelName: "mychannel", 
      contractName: "blue-coin", 
      funcName: "getTransactionHistory", 
      argArr: ["Org1MSP"]
    });

  console.log("response:"+JSON.stringify(response, null, 4));
  console.log("response:"+JSON.stringify(response.payload.result[0].TxId, null, 4));
  let txId = response.payload.result[1].TxId;
  let txDetail = await txMgr.queryTransaction(
    {
      userId: "user1",
      channelName: "mychannel",
      peerName: "peer0.org1.example.com",
      txId: txId
    });
  
  console.log("txDetail: " + JSON.stringify(txDetail, null, 4))
*/
}

main();