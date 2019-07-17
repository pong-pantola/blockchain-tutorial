'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

//const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
//const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
//const ccp = JSON.parse(ccpJSON);

class UserManager{
  constructor(config){
    this.networkDirPath = path.join(config.fabricSample.homePath, config.fabricSample.networkDirPath);
    this.connectionFilePath = path.join(config.fabricSample.homePath, config.fabricSample.connectionFilePath);
    this.walletDirPath = config.walletDirPath;

    this.connectionConfig = require(this.connectionFilePath);
  }

  async registerUser(userId, affiliation, role, adminId){


    // Create a new file system based wallet for managing identities.
    //const walletPath = path.join(process.cwd(), 'wallet');
    //const wallet = new FileSystemWallet(walletPath);
    //console.log(`Wallet path: ${walletPath}`);
    const wallet = new FileSystemWallet(this.walletDirPath);

    // Check to see if we've already enrolled the user.
    //const userExists = await wallet.exists('user1');
    const userExists = await wallet.exists(userId);
    if (userExists) {
        //console.log('An identity for the user "user1" already exists in the wallet');
        //return;
      throw Error("User " + userId + " already exists in the wallet.");
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(adminId);
    if (!adminExists) {
        //console.log('An identity for the admin user "admin" does not exist in the wallet');
        //console.log('Run the enrollAdmin.js application before retrying');
        //return;
      throw Error("Administrator " + adminId + " does not exist in the wallet.  You need an administrator to register another user.");
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    //await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
    await gateway.connect(this.connectionFilePath, { wallet, identity: adminId, discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    //const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
    const secret = await ca.register({ affiliation: affiliation, enrollmentID: userId, role: role }, adminIdentity);











  ////////////////////////////////////////////////////////////////////////////////////////////////
    // Create a new file system based wallet for managing identities.
    //const walletPath = path.join(process.cwd(), 'wallet');
    //const wallet = new FileSystemWallet(walletPath);
    //console.log(`Wallet path: ${walletPath}`);
    const wallet = new FileSystemWallet(this.walletDirPath);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userId);
    if (userExists) {
      throw Error("User " + userId + " already exists in the wallet.");
        //console.log('An identity for the user "user1" already exists in the wallet');
        //return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(adminId);
    if (!adminExists) {
      //console.log('An identity for the admin user "admin" does not exist in the wallet');
      //console.log('Run the enrollAdmin.js application before retrying');
      //return;
      throw Error("Administrator " + adminId + " does not exist in the wallet.  You need an administrator to register another user.");
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    //await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
    await gateway.connect(this.connectionFilePath, { wallet, identity: adminId, discovery: { enabled: true, asLocalhost: true } });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    //const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
    const userSecret = await ca.register({ affiliation: affiliation, enrollmentID: userId, role: role }, adminIdentity);

    return userSecret;

  }

  async enrollUser(userId, userSecret, mspId){
    //const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: userSecret });
    //const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    const userIdentity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
    //wallet.import('user1', userIdentity);
    await wallet.import(userId, userIdentity);
    //console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');



//////////////////////////////////////////
    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: userSecret });
    //const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    const userIdentity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
    //await wallet.import('user1', userIdentity);
    await wallet.import(userId, userIdentity);
    //console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
  }


  async enrollAdmin(adminId, adminSecret, caId, mspId){


    // Create a new CA client for interacting with the CA.
    //const caURL = ccp.certificateAuthorities['ca.example.com'].url;
    const caURL = this.connectionConfig.certificateAuthorities[caId].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    //const walletPath = path.join(process.cwd(), 'wallet');
    //const wallet = new FileSystemWallet(walletPath);
    //console.log(`Wallet path: ${walletPath}`);
    const wallet = new FileSystemWallet(this.walletDirPath);

    // Check to see if we've already enrolled the admin user.
    //const adminExists = await wallet.exists('admin');
    const adminExists = await wallet.exists(adminId);
    if (adminExists) {
      //console.log('An identity for the admin user "admin" already exists in the wallet');
      //return;
      throw Error("Administrator " + adminId + " already exists in the wallet.");
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: adminSecret });
    const identity = X509WalletMixin.createIdentity(mspId, enrollment.certificate, enrollment.key.toBytes());
    wallet.import(adminId, identity);
    //console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

  }



}


module.exports = UserManager;

/*
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}


*/