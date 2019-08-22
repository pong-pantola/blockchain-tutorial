const FabricCAServices = require('fabric-ca-client')
const { FileSystemWallet, X509WalletMixin } = require('fabric-network')

async function enrollAdmin(config, param){
  const connectionConfigFilePath = config.connectionConfigFilePath
  const walletDirPath = config.walletDirPath
  const connectionConfig = require(connectionConfigFilePath)

  // Create a new CA client for interacting with the CA.
  const caURL = connectionConfig.certificateAuthorities[param.caId].url
  const ca = new FabricCAServices(caURL)

  // Create a new file system based wallet for managing identities.
  const wallet = new FileSystemWallet(walletDirPath)

  // Check to see if we've already enrolled the admin user.
  const adminExists = await wallet.exists(param.adminId)
  if (adminExists) {
    throw Error("Administrator " + param.adminId + " already exists in the wallet.")
  }

  // Enroll the admin user, and import the new identity into the wallet.
  const enrollment = await ca.enroll({ enrollmentID: param.adminId, enrollmentSecret: param.adminSecret })
  const identity = X509WalletMixin.createIdentity(param.mspId, enrollment.certificate, enrollment.key.toBytes())
  wallet.import(param.adminId, identity)
}


async function main(orgIndex){
  try{
    const config = require(`./config/config-org${orgIndex}.json`)

    const param = {
      adminId: "admin",
      adminSecret: "adminpw",
      caId: `ca${orgIndex}.example.com`,
      mspId:  `Org${orgIndex}MSP`
    }

    console.log(`Enrolling Administrator admin of org${orgIndex}...`)
    await enrollAdmin(config, param);
    console.log(`Administrator admin of org${orgIndex} enrolled successfully.`)
  }catch(error){
    console.log(error)
  }
}

if (process.argv.length != 3){
  console.log("Syntax : node enrollAdmin.js <org index>")
  console.log("Example: node enrollAdmin.js 1")
}else{
  main(process.argv[2])
}
