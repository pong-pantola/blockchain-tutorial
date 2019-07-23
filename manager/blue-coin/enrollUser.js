const UserManager = require("./UserManager.js")

const path = require('path');

const config = require("./config/config.json")

let userMgr = new UserManager(config);

async function enroll(userId, affiliation, role){
  try{
    console.log("Registering User "+userId+"...")
    let userSecret = await userMgr.registerUser(userId, affiliation, role, "admin");
    console.log("User "+userId+" registered successfully.")
    console.log("Enrolling User "+userId+"...")
    await userMgr.enrollUser(userId, userSecret, "admin", "Org1MSP");
    console.log("User "+userId+" enrolled successfully.")
  }catch(error){
    console.log(error)
  }
}

async function main(){
  await enroll("user1", "org1.department1", "client")
  await enroll("user2", "org1.department1", "client")
}

main();
