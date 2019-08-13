const jwt = require('jsonwebtoken');

const middleware = {};

middleware.validateToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        res.status(401).send({msg: "No token provided."})
    } else {
        jwt.verify(token, req.app.locals.secretKey, function (err, payload) {
            if (err) {
                res.status(401).send({msg: "Invalid token: " + err})
            } else {
                res.locals.username = payload.username;
                next();
            }
    });
    }
};

module.exports = middleware;