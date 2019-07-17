const UserManager = require("./UserManager.js")

const path = require('path');

const config = require("./config/config.json")
//const networkDirPath = path.join("..", "..", "network", "first-network");
//const connectionFilePath = path.join(networkPath, "connection-org1.json");
//const = walletDirPath = path.join("..", "..", "wallet");

let userMgr = new UserManager(config);

async function main(){
  try{
    console.log("Enrolling Administrator admin...")
    await userMgr.enrollAdmin("admin", "adminpw", "ca.org1.example.com", "Org1MSP");
    console.log("Administrator admin enrolled successfully.")
  }catch(error){
    console.log("Error: " + error)
  }

  try{
    console.log("Registering User user1...")
    let userSecret = await userMgr.registerUser("user1", "org1.department!", "client", "admin");
    console.log("User user1 registered successfully.")
    console.log("Enrolling User user1...")
    enrollUser(userId, userSecret, "Org1MSP");
    console.log("User user1 enrolled successfully.")
  }catch(error){
    console.log("Error: " + error)
  }
}
