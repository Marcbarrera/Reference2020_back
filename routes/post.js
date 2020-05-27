const express = require("express");
const {getPosts, addPhoto, createPost, postsByUser, postById, isPoster, updatePost, deletePost, photo1, photo2, photo_target, photo_reference, singlePost } = require("../controllers/post");
const { requireSignin} = require("../controllers/auth");//ojo amb això que fa que els posts només es puguin veure si s'ha fet loggin. 
const { userById } = require("../controllers/user");
const {createPostValidator} = require('../validator')

const router = express.Router();

// router.get("/", getPosts); //requireSignin-> veure els post nomes si s'ha fet signin. Actualitzacio. s'ha passat el middleware a crear post
router.get("/posts", getPosts);

router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.post('/post/addPhoto', addPhoto);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);


router.get("/post/photo1/:postId", photo1);
router.get("/post/photo2/:postId", photo2);
router.get("/post/photo_target/:postId", photo_target);
router.get("/post/photo_target/:postId", photo_reference);







// totes les rutes que contenen :userId, l'app executarà primer userByID(). 
router.param('userId', userById);
// totes les rutes que contenen :postId, l'app executarà primer postByID(). 

router.param('postId', postById);

module.exports = router;