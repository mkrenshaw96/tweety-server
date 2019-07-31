const router = require('express').Router();
const db = require('../db');
const AUTH = require('../Middleware/auth');
const ADMIN = require('../Middleware/admin');

//INCREMENT LIKE_AMOUNT ON POST
// const incrementLike = (x) => {
//     router.put('/increment-like', AUTH, (req, res) => {
//         db.Post.findOne({
//             where: {
//                 id: x
//             }
//         })
//             .then(foundPost => {
//                 db.Post.update({ "like_amount": foundPost.like_amount + 1 }, {
//                     where: {
//                         id: x
//                     }
//                 })
//                     .then(likedPost => res.status(200).json(likedPost))
//                     .catch(err => res.status(500).json(err))
//             })
//             .catch(err => res.status(500).json(err))
//     })
// }

//LIKE A POST BY ID
router.post('/create/:id', AUTH, (req, res) => {
    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(foundPost => {
            foundPost.createLike({
                userUuid: req.user.uuid
            })
                .then(createdLike => {
                    res.status(200).json(createdLike)
                    // incrementLike(req.params.id)
                })
                .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
})

//GET ALL LIKE (ADMIN ACCESS ONLY)
router.get('/all-likes', ADMIN, (req, res) => {
    db.Like.findAll({
        include: {
            model: db.User
        }
    })
        .then(foundLikes => res.status(200).json(foundLikes))
        .catch(err => res.status(500).json(err))
})

//GET ALL LIKES FOR A SINLGE POST
router.get('/post-likes/:id', AUTH, (req, res) => {
    db.Like.findAll({
        where: {
            postId: req.params.id
        }, include: {
            model: db.User
        }
    })
        .then(foundLikes => res.status(200).json(foundLikes))
        .catch(err => res.status(500).json(err))
})
module.exports = router;