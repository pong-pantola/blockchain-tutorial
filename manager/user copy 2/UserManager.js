'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

class UserManager{
  constructor(config){
    this.connectionConfigFilePath = config.connectionConfigFilePath;
    this.walletDirPath = config.walletDirPath;

    this.connectionConfig = require(this.connectionConfigFilePath);
  }

  async registerUser(userId, affiliation, role, adminId){
    let gateway;
    try{
      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(userId);
      if (userExists) {
        throw Error("User " + userId + " already exists in the wallet.");
      }

      // Check to see if we've already enrolled the admin user.
      const adminExists = await wallet.exists(adminId);
      if (!adminExists) {
        throw Error("Administrator " + adminId + " does not exist in the wallet.  You need an administrator to register another user.");
      }

      // Create a new gateway for connecting to our peer node.
      gateway = new Gateway();

      await gateway.connect(this.connectionConfigFilePath, { wallet, identity: adminId, discovery: { enabled: false } });

      // Get the CA client object from the gateway for interacting with the CA.
      const ca = gateway.getClient().getCertificateAuthority();
      const adminIdentity = gateway.getCurrentIdentity();

      // Register the user, enroll the user, and import the new identity into the wallet.
      const userSecret = await ca.register({ affiliation: affiliation, enrollmentID: userId, role: role }, adminIdentity);

      return userSecret;
    }catch(error){
      throw error;
    }finally{
      if (gateway)
        gateway.disconnect();
    }
  }

  async enrollUser(userId, userSecret, adminId, mspId){
    let gateway;
    try{
      // Create a new file system based wallet for managing identities.
      const wallet = new FileSystemWallet(this.walletDirPath);

      // Create a new gateway for connecting to our peer node.
      gateway = new Gateway();

      await gateway.connect(this.connectionConfigFilePath, { wallet, identity: adminId, discovery: { enabled: false } });

      // Get the CA client object from the gateway for interacting with the CA.
      const ca = gateway.getClient().getCertificateAuthority();

      const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: userSecret });

      const userIdentity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());

      await wallet.import(userId, userIdentity);
    }catch(error){
      throw error;
    }finally{
      if (gateway)
        gateway.disconnect();
    }
  }


  async enrollAdmin(adminId, adminSecret, caId, mspId){
    // Create a new CA client for interacting with the CA.
    const caURL = this.connectionConfig.certificateAuthorities[caId].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const wallet = new FileSystemWallet(this.walletDirPath);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(adminId);
    if (adminExists) {
      throw Error("Administrator " + adminId + " already exists in the wallet.");
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: adminSecret });
    const identity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
    wallet.import(adminId, identity);
  }
}


module.exports = UserManager;

