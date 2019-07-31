const UserManager = require("./UserManager.js")

const path = require('path');

const config = require("./config/config.json")

let userMgr = new UserManager(config);

async function main(){
  try{
    console.log("Enrolling Administrator admin...")
    await userMgr.enrollAdmin("admin", "adminpw", "ca1.example.com", "Org1MSP");
    console.log("Administrator admin enrolled successfully.")
  }catch(error){
    console.log(error)
  }
}

main();
