const router = require('express').Router();
const db = require('../db');
const AUTH = require('../Middleware/auth');
const ADMIN = require('../Middleware/admin');
router.get('/', (req, res) => res.send('POSTS WORKS'))
router.post('/make-post', AUTH, (req, res) => {
    db.Post.create({
        text: req.body.text
    })
        .then(created => res.status(200).json(created))
        .catch(err => res.status(500).json(err))
})
module.exports = router;