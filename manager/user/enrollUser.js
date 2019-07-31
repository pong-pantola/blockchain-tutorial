const UserManager = require("./UserManager.js")

const path = require('path');

const config = require("./config/config.json")

let userMgr = new UserManager(config);

async function enroll(userId, affiliation, role, attrArr){
  try{
    console.log("Registering User "+userId+"...")
    let userSecret = await userMgr.registerUser(userId, affiliation, role, attrArr, "admin");
    console.log("User "+userId+" registered successfully.")
    console.log("Enrolling User "+userId+"...")
    await userMgr.enrollUser(userId, userSecret, "admin", "Org1MSP");
    console.log("User "+userId+" enrolled successfully.")
  }catch(error){
    console.log(error)
  }
}

async function main(){
  await enroll("user1", "org1.department1", "client", [{ name: "affiliation", value: "", ecert: true }, { name: "enrollmentID", value: "en1", ecert: true }])
  await enroll("user2", "org1.department1", "client", [{ name: "affiliation", value: "", ecert: true }, { name: "enrollmentID", value: "en1", ecert: true }])
  //await enroll("user1", "org2.department1", "client", [{ name: "affiliation", value: "", ecert: true }, { name: "enrollmentID", value: "en1", ecert: true }])
  //await enroll("user2", "org2.department1", "client", [{ name: "affiliation", value: "", ecert: true }, { name: "enrollmentID", value: "en1", ecert: true }])  
}

main();
