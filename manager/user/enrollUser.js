const UserManager = require("./UserManager.js")

const path = require('path');

const config = require("./config/config.json")

let userMgr = new UserManager(config);

async function main(){
  try{
    console.log("Registering User user1...")
    let userSecret = await userMgr.registerUser("user1", "org1.department1", "client", "admin");
    console.log("User user1 registered successfully.")
    console.log("Enrolling User user1...")
    enrollUser("user1", userSecret, "admin", "Org1MSP");
    console.log("User user1 enrolled successfully.")
  }catch(error){
    console.log("Error: " + error)
  }
}

main();
