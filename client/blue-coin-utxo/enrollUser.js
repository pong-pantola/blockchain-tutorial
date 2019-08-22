const FabricCAServices = require('fabric-ca-client')
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network')

async function registerUser(config, param){
  let gateway

  const connectionConfigFilePath = config.connectionConfigFilePath
  const walletDirPath = config.walletDirPath
  const connectionConfig = require(connectionConfigFilePath) 

  try{
    // Create a new file system based wallet for managing identities.
    const wallet = new FileSystemWallet(walletDirPath)

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(param.userId)
    if (userExists) {
      throw Error("User " + param.userId + " already exists in the wallet.")
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(param.adminId)
    if (!adminExists) {
      throw Error("Administrator " + param.adminId + " does not exist in the wallet.  You need an administrator to register another user.")
    }

    // Create a new gateway for connecting to our peer node.
    gateway = new Gateway()

    await gateway.connect(connectionConfigFilePath, { wallet, identity: param.adminId, discovery: { enabled: false } })

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority()
    const adminIdentity = gateway.getCurrentIdentity()

    // Register the user, enroll the user, and import the new identity into the wallet.
    const userSecret = await ca.register({ enrollmentID: param.userId, role: param.role, attrs: param.attrArr}, adminIdentity)

    return userSecret
  }catch(error){
    throw error
  }finally{
    if (gateway)
      gateway.disconnect()
  }
}

async function enrollUser(config, param){    
  let gateway

  const connectionConfigFilePath = config.connectionConfigFilePath
  const walletDirPath = config.walletDirPath
  const connectionConfig = require(connectionConfigFilePath)

  try{
    // Create a new file system based wallet for managing identities.
    const wallet = new FileSystemWallet(walletDirPath)

    // Create a new gateway for connecting to our peer node.
    gateway = new Gateway()

    await gateway.connect(connectionConfigFilePath, { wallet, identity: param.adminId, discovery: { enabled: false } })

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority()

    const enrollment = await ca.enroll({ enrollmentID: param.userId, enrollmentSecret: param.userSecret })

    const userIdentity = X509WalletMixin.createIdentity(param.mspId, enrollment.certificate, enrollment.key.toBytes())

    await wallet.import(param.userId, userIdentity)
  }catch(error){
    throw error
  }finally{
    if (gateway)
      gateway.disconnect()
  }
}


async function main(orgIndex, userIndex){
  try{
    const config = require(`./config/config-org${orgIndex}.json`)

    const registerParam = {
      userId: `user${userIndex}`,
      role: "client",
      attrArr: [{ name: "attrA", value: "valA", ecert: true }, { name: "attrB", value: "valB", ecert: true }],
      adminId: "admin"
    }

    console.log(`Registering User user${userIndex}... of org${orgIndex}`)
    let userSecret = await registerUser(config, registerParam);
    console.log(`User user${userIndex} of org${orgIndex} registered successfully.`)

    const enrollParam = {
      userId: `user${userIndex}`,
      userSecret: userSecret,
      adminId: "admin",
      mspId: `Org${orgIndex}MSP`
    }

    console.log(`Enrolling User user${userIndex}... of org${orgIndex}`)
    await enrollUser(config, enrollParam);
    console.log(`User user${userIndex} of org${orgIndex} enrolled successfully.`)

  }catch(error){
    console.log(error)
  }
}

if (process.argv.length != 4){
  console.log("Syntax : node enrollUser.js <org index> <user index>")
  console.log("Example: node enrollUser.js 1 2")
}else{
  main(process.argv[2], process.argv[3])
}
