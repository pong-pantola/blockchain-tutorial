const jwt = require('jsonwebtoken');

const authHelper = require("../helper/AuthHelper.js")

let controller = {}

controller.login = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (!authHelper.checkLogin(username, password))
    res.status(401).send({msg: "Invalid username and/or password!"})
  else{
    const payload = {
      username: username
    }

    const option = {
      expiresIn: req.app.locals.expiration
    }

    const token = jwt.sign(payload, req.app.locals.secretKey, option);

    res.status(200).send({msg: "Successful login.", token: token})
  }
}

module.exports = controller