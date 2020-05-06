
const express = require("express");
const {getPosts, createPost} = require("../controllers/post");
const { requireSignin} = require("../controllers/auth");//ojo amb això que fa que els posts només es puguin veure si s'ha fet loggin. video 47
const { userById } = require("../controllers/user");
const {createPostValidator} = require('../validator')

const router = express.Router();

router.get("/", getPosts); //requireSignin-> veure els post nomes si s'ha fet signin. Actualitzacio. s'ha passat el middleware a crear post
router.post("/post", requireSignin, createPostValidator, createPost);

// totes les rutes que tenen :userID. 
router.param("userId", userById)

module.exports = router;
