const router = require('express').Router();
const db = require('../db');
const AUTH = require('../Middleware/auth');
const ADMIN = require('../Middleware/admin');

//CREATE A SINGLE POST TIED TO THE USER ID BY ASSOCIATION
router.post('/create-post', AUTH, (req, res) => {
    //FIND THE USER TO BE TIED TO THE POST
    db.User.findOne({
        where: {
            uuid: req.user.uuid
        }
    })
        //FOUNDUSER VARIABLE IS DECALARED WITH THE DATA WE GET BACK FROM THE QUERY
        .then(foundUser => {
            //TAKE THE FOUND USER AND CREATE THE POST 
            //THIS AUTOMATICALLY CREATED THE RELATION SHIP IN THE TABLE FOR QUERYING LATER ON
            foundUser.createPost({
                //GREB THE TEXT FROM THE BODY OBJECT
                text: req.body.text,
                //INITIALIZES THE REPOST AMOUNT AT ZERO
                repost_amount: 0,
                //INITIALIZES THE LIKE AMOUNT AR ZERO
                like_amount: 0
            })
                //RETURN OUR CREATED POST AS JSON DATA
                .then(created => res.status(200).json(created))
                //CATCH ANY POTENTIAL ERRORS
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})

//FIND ALL POST FOR ALL USERS (ADMIN ONLY ACCESSABLE ROUTE)
router.get('/all-post', ADMIN, (req, res) => {
    db.Post.findAll({
        include: {
            model: db.User
        }
    })
        .then(foundPosts => res.status(200).json(foundPosts))
        .catch(err => res.status(500).json(err))
})

//FIND ALL POST FOR A SPECIFIED USER 
router.get('/user-post', AUTH, (req, res) => {
    db.Post.findAll({
        where: {
            userUuid: req.user.uuid
        }, include: {
            model: db.User
        }
    })
        .then(foundPosts => res.status(200).json(foundPosts))
        .catch(err => res.status(500).json(err))
})

//DELETE A POST BY ID 
router.delete('/delete/:id', AUTH, (req, res) => {
    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(foundPost => foundPost.destroy())
        .then(() => res.status(200).json({ message: "POST SUCCESSFULLY DELETED" }))
        .catch(err => res.status(500).json(err))
})

//EDIT A POST BY ID
router.put('/edit-post/:id', AUTH, (req, res) => {
    db.Post.update(req.body, {
        where: {
            id: req.params.id
        }, returning: true
    })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(500).json(err))
})
module.exports = router;