'use strict';



const { FileSystemWallet, Gateway } = require('fabric-network');



class TransactionManager{

  constructor(config){

    this.connectionConfigFilePath = config.connectionConfigFilePath;

    this.walletDirPath = config.walletDirPath;



    this.connectionConfig = require(this.connectionConfigFilePath);

  }

  async queryTransactionX(txId){
var Fabric_Client = require('fabric-client');
//Fabric_Client.newDefaultKeyValueStore({ path: "../../walletx"})
console.log("step 1");
var fabric_client = new Fabric_Client();
console.log("step 2");
fabric_client.setUserContext('user1', true);
console.log("step 3");
// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
console.log("step 4");
var peer = fabric_client.newPeer('grpc://localhost:7051');
console.log("step 5");
channel.addPeer(peer);
console.log("step 6");

let pTx = await channel.queryTransaction(txId)
console.log("step 7");
  return pTx;
  }


  async queryTransaction(userId, channelName, peerName, txId){
    let gateway;



    try{
      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(userId);

      if (!userExists) {
        throw Error("User " + userId + " does not exist in the wallet.");
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();

      //await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
      await gateway.connect(this.connectionConfig, { wallet, identity: userId, discovery: { enabled: false } });

      const client = gateway.getClient();

      let peerUrl;
      if (this.connectionConfig.peers &&
          this.connectionConfig.peers[peerName] &&
          this.connectionConfig.peers[peerName].url)
        peerUrl = this.connectionConfig.peers[peerName].url;
      else
        throw Error("Cannot find URL of peer " + peerName + " in connection profile.");

      const peer = client.newPeer(peerUrl);
      const channel = client.newChannel(channelName);

      const pTx = await channel.queryTransaction(txId, peer)

      const txDetail = pTx.transactionEnvelope.payload.data.actions[0];
      //const header = txDetail.header;
      const payload = txDetail.payload;
    
      //console.log("pTx:"+JSON.stringify(pTx.transactionEnvelope.payload.data.actions[0], null, 4));
    
      //let nonce = header.nonce;
      //console.log("nonce:" + nonce.toString("utf16le"));
    
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





  async submitTransaction(userId, channelName, contractName, funcName, ...args){

    let gateway;



    try{

      // Create a new file system based wallet for managing identities.

      const wallet = new FileSystemWallet(this.walletDirPath);



      // Check to see if we've already enrolled the user.

      const userExists = await wallet.exists(userId);

      if (!userExists) {

        throw Error("User " + userId + " does not exist in the wallet.");

      }



      // Create a new gateway for connecting to our peer node.

      const gateway = new Gateway();

      //await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

      await gateway.connect(this.connectionConfig, { wallet, identity: userId, discovery: { enabled: false } });



      // Get the network (channel) our contract is deployed to.

      //const network = await gateway.getNetwork('mychannel');

      const network = await gateway.getNetwork(channelName);



      // Get the contract from the network.

      //const contract = network.getContract('fabcar');

      const contract = network.getContract(contractName);



      // Submit the specified transaction.

      // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')

      // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')

      //await contract.submitTransaction('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom');

      const response = await contract.submitTransaction(funcName, ...args);



      return JSON.parse(response.toString());

        //console.log('Transaction has been submitted');





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

  //console.log("response:"+response);



  let response

  //response = await txMgr.submitTransaction("user1", "mychannel", "blue-coin", "getBalance", "Org1MSP");

  //console.log("response:"+JSON.stringify(response, null, 4));



  response = await txMgr.submitTransaction("user1", "mychannel", "blue-coin", "getTransactionHistory", "Org1MSP");


  console.log("response:"+JSON.stringify(response.payload.result[0].TxId, null, 4));
  let txId = response.payload.result[1].TxId;
  let txDetail = await txMgr.queryTransaction("user1", "mychannel", txId);
  console.log("txDetail: " + JSON.stringify(txDetail, null, 4))

}

main();