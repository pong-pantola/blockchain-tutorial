'use strict';

const CHANNEL_NAME = "mychannel"
const CONTRACT_NAME = "blue-coin"

const TransactionManager = require("../transaction/TransactionManager.js")
const fs = require('fs')
const path = require('path')

class BlueCoinManager{
  constructor(config){
    this.txMgr = new TransactionManager(config)
  }

  async generateInitialCoin(argArr, userId, callback){
    const param = {
      userId: userId, 
      channelName: CHANNEL_NAME,
      contractName: CONTRACT_NAME, 
      funcName: "generateInitialCoin", 
      argArr: argArr,
      callback: callback
    }
    const response = await this.txMgr.submitTransaction(param)

    return response
  }

  async getBalance(argArr, userId){
    const param = {
      userId: userId, 
      channelName: CHANNEL_NAME,
      contractName: CONTRACT_NAME, 
      funcName: "getBalance", 
      argArr: argArr
    }
    const response = await this.txMgr.evaluateTransaction(param)

    return response
  }

  async transferCoin(argArr, userId, callback){
    const param = {
      userId: userId, 
      channelName: CHANNEL_NAME,
      contractName: CONTRACT_NAME, 
      funcName: "transferCoin", 
      argArr: argArr,
      callback: callback
    }
    const response = await this.txMgr.submitTransaction(param)

    return response
  }  

}

module.exports = BlueCoinManager

