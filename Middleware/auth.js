const jwt = require('jsonwebtoken');
const db = require('../db');
const Auth = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
        if (!err && decoded) {
            db.User.findOne({
                where: {
                    uuid: decoded.uuid
                }
            })
                .then(foundUser => {
                    if (!foundUser && err) throw err;
                    req.user = foundUser
                    return next();
                })
                .catch(err => {
                    next(err)
                })
        } else {
            req.errors = err
            return res.status(401).json({
                message: 'NOT AUTHORIZED',
                status: 401
            })
        }
    })
}
module.exports = Auth;