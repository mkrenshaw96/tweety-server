const jwt = require('jsonwebtoken');
const db = require('../db');
const Admin = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
        if (!err && decoded && decoded.id === 1) {
            db.User.findOne({
                where: {
                    id: decoded.id
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
                message: 'NOT AUTHORIZED FOR ADMIN ONLY ROUTE',
                status: 401
            })
        }
    })
}
module.exports = Admin;