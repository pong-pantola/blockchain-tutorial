const UserManager = require("./UserManager.js")

async function main(orgIndex, userIndex){
  try{
    const config = require(`./config/config-org${orgIndex}.json`)
    const userMgr = new UserManager(config);

    const registerParam = {
      userId: `user${userIndex}`,
      affiliation: `org${orgIndex}.department1`,
      role: "client",
      attrArr: [{ name: "attrA", value: "valA", ecert: true }, { name: "attrB", value: "valB", ecert: true }],
      adminId: "admin"
    }

    console.log(`Registering User user${userIndex}... of org${orgIndex}`)
    let userSecret = await userMgr.registerUser(registerParam);
    console.log(`User user${userIndex} of org${orgIndex} registered successfully.`)

    const enrollParam = {
      userId: `user${userIndex}`,
      userSecret: userSecret,
      adminId: "admin",
      mspId: `Org${orgIndex}MSP`
    }

    console.log(`Enrolling User user${userIndex}... of org${orgIndex}`)
    await userMgr.enrollUser(enrollParam);
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
