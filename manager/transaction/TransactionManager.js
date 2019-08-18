'use strict';
process.env.HFC_LOGGING='{}'
//process.env.HFC_LOGGING='{"info":"console"}'

const { FileSystemWallet, Gateway } = require('fabric-network');

class TransactionManager{

  constructor(config){
    this.connectionConfigFilePath = config.connectionConfigFilePath;
    this.walletDirPath = config.walletDirPath;
    this.connectionConfig = require(this.connectionConfigFilePath);
  }

  async submitTransaction(param){

    let gateway;

    try{

      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(param.userId);

      if (!userExists) {
        return {status: 500, message: "User " + param.userId + " does not exist in the wallet."};
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

  async evaluateTransaction(param){

    let gateway;

    try{

      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(param.userId);

      if (!userExists) {
        return {status: 500, message: "User " + param.userId + " does not exist in the wallet."};
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();

      await gateway.connect(this.connectionConfig, { wallet, identity: param.userId, discovery: { enabled: false } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(param.channelName);

      // Get the contract from the network.
      const contract = network.getContract(param.contractName);

      let response = await contract.evaluateTransaction(param.funcName, ...param.argArr);

      return JSON.parse(response.toString());
    }catch(error){
      return {status: 500, message: error.toString()};
    }finally{
      if (gateway)
        gateway.disconnect();
    }
  }

  async getTransactionDetail(param){
    let gateway;

    try{
      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(param.userId);

      if (!userExists) {
        return {status: 500, message: "User " + param.userId + " does not exist in the wallet."};
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
        return {status: 500, message: "Cannot find URL of peer " + param.peerName + " in connection profile."};

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
      return {status: 500, message: error.toString()};

    }finally{

      if (gateway)

        gateway.disconnect();

    }
  }
}

module.exports = TransactionManager;
