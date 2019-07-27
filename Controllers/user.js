require('dotenv').config();
const router = require('express').Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AUTH = require('../Middleware/auth');
const ADMIN = require('../Middleware/admin');

//ROUTE TO SIGN UP A NEW USER
router.post('/signup', (req, res) => {

    //THE BELOW VARIABLES ARE USED TO CREATED A 'JOIN DATE' WHEN EVER A NEW USER IS CREATED
    const date = new Date;
    const today = date.toString()

    //BELOW OBJECT IS USED TO CREATE THE SIGN UP DATA THAT IS PLACED IN THE CREATE METHOD BELOW
    const signUpData = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        //HASH SYNC (SALT) PASSWORD FOR ENCRYPTION
        password: bcrypt.hashSync(req.body.password),
        //NEEDS TO BE REPLACED WITH A DEFAULT PICTURE LATER ON WHEN S3 IS IN USE
        profile_pic_url: 'blank...',
        //NEEDS TO BE REPLACED WHEN LOCATION SELECT IS IMPLEMENTED
        location: 'blank...',
        //NEEDS TO BE REPLACED WHEN DATE SELECTION IS CREATED
        date_of_birth: req.body.date_of_birth,
        join_date: today
    }

    db.User.create(signUpData)
        .then(createdUser => {
            let token = jwt.sign({
                id: createdUser.id,
            }, process.env.JWT_SECRET, {
                    expiresIn: 60 * 60 * 24
                })
            res.status(200).json({
                message: 'USER SUCCESSFULLY CREATED',
                sessionToken: token,
                status: 200,
                createdUser: createdUser
            })
        })
        .catch(err => res.status(500).json(err))
})

//ROUTE TO LOGIN A USER 
router.post('/login', (req, res) => {
    db.User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(foundUser => {
            bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
                if (match) {
                    let token = jwt.sign({
                        id: foundUser.id,
                    }, process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24
                        })
                    res.status(200).json({
                        message: 'USER SUCCESSFULLY LOGGED IN',
                        sessionToken: token,
                        status: 200,
                        foundUser: foundUser
                    })
                } else {
                    res.status(401).json({ status: 401, message: 'PASSWORDS DO NOT MATCH' })
                }
            })
        })
        .catch(err => res.status(404).json({ status: 404, message: 'USERNAME IS NOT FOUND' }))
})

//ROUTE TO DELETE A USER (WITH ADMIN AUTHENTICATION)
router.delete('/delete/:id', ADMIN, (req, res) => {
    db.User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(foundUser => {
            console.log(req.user.id)
            if (req.user.id === 1) {
                foundUser.destroy()
                    .then(() => res.status(200).json('USER SUCCESSFULLY DESTROYED'))
                    .catch(err => console.log(err))
            } else {
                res.status(401).json('NOT ALLOWED')
            }
        })
        .catch(err => console.log(err))
})

//ROUTE TO GET ALL USERS
router.get('/all', ADMIN, (req, res) => {
    db.User.findAll()
        .then(foundUsers => res.status(200).json(foundUsers))
        .catch(err => res.status(500).json(err))
})

//EDIT USER DATA 
router.put('/edit/:id', AUTH, (req, res) => {
    db.User.update(req.body, {
        where: {
            id: req.params.id
        }, returning: true
    })
        .then(updateUser => res.status(200).json(updateUser))
        .catch(err => res.status(500).json(err))
})

module.exports = router;