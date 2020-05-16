const express = require("express");
const {getPosts, createPost, postsByUser, postById, isPoster,updatePost, deletePost } = require("../controllers/post");
const { requireSignin} = require("../controllers/auth");//ojo amb això que fa que els posts només es puguin veure si s'ha fet loggin. 
const { userById } = require("../controllers/user");
const {createPostValidator} = require('../validator')

const router = express.Router();

router.get("/", getPosts); //requireSignin-> veure els post nomes si s'ha fet signin. Actualitzacio. s'ha passat el middleware a crear post

router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/posts/by/userId",requireSignin, postsByUser) //ojo requireSignin
router.put('/post:postId', requireSignin, isPoster, updatePost)
router.delete('/post:postId', requireSignin, isPoster, deletePost)






// totes les rutes que contenen :userId, l'app executarà primer userByID(). 
router.param('userId', userById);
// totes les rutes que contenen :postId, l'app executarà primer postByID(). 

router.param('postId', postById);

module.exports = router;