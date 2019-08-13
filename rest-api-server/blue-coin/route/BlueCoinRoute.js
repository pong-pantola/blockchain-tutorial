let express = require('express')

let router = express.Router()

let BlueCoinController = require("../controller/BlueCoinController.js")

router.post("/generateInitialCoin/:userId/:mspId", BlueCoinController.generateInitialCoin)

router.get("/getBalance/:userId/:mspId", BlueCoinController.getBalance)

router.post("/transferCoin/:userId", BlueCoinController.transferCoin)

router.get("/getTransactionHistory/:userId/:mspId", BlueCoinController.getTransactionHistory)

module.exports = router