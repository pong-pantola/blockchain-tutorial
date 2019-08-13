let express = require('express');

let router = express.Router();

let AuthController = require("../controller/AuthController.js")

router.post("/login", AuthController.login);

module.exports = router