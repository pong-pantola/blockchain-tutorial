const UserManager = require("./UserManager.js")

async function main(orgIndex){
  try{
    const config = require(`./config/config-org${orgIndex}.json`)
    const userMgr = new UserManager(config);

    const param = {
      adminId: "admin",
      adminSecret: "adminpw",
      caId: `ca${orgIndex}.example.com`,
      mspId:  `Org${orgIndex}MSP`
    }

    console.log(`Enrolling Administrator admin of org${orgIndex}...`)
    await userMgr.enrollAdmin(param);
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
