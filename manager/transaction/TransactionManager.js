'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');

class TransactionManager{
  constructor(config){
    this.connectionConfigFilePath = config.connectionConfigFilePath;
    this.walletDirPath = config.walletDirPath;

    this.connectionConfig = require(this.connectionConfigFilePath);
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
      await gateway.connect(this.connectionConfigFilePath, { wallet, identity: userId, discovery: { enabled: false } });

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

      return response;
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
  const response = await txMgr.submitTransaction("user1", "mychannel", "blue-coin", "generateInitialCoin", "user1");
  console.log("response:"+response);


  const response = await txMgr.submitTransaction("user1", "mychannel", "blue-coin", "getBalance", "user1");
  console.log("response:"+response);

}