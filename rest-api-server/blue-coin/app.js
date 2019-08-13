if (process.argv.length != 3){
  console.log("Syntax : node app.js <org index>")
  console.log("Example: node app.js 1")
  process.exit(1)
}
const orgIndex = process.argv[2]

const express = require("express")
const BlueCoinManager = require("../../manager/blue-coin/BlueCoinManager.js")
const config = require(`./config/config-org${orgIndex}.json`)

const app = express();app.listen(config.portNo, () => {
 console.log("Server running on port " + config.portNo);
});

app.locals.bcMgr = new BlueCoinManager(config)
app.locals.secretKey = config.token.secretKey
app.locals.expiration = config.token.expiration

app.use(express.json())

let authRoute = require('./route/AuthRoute.js')
let blueCoinRoute = require('./route/BlueCoinRoute.js')

let authMiddleware = require('./middleware/AuthMiddleware.js')

app.use("/auth", authRoute)
//app.use(authMiddleware.validateToken);
app.use("/blue-coin", blueCoinRoute)
