const express = require("express");
const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto, addFollowing, addFollower, removeFollowing, removeFollower} = require("../controllers/user");
const { requireSignin} = require("../controllers/auth");//ojo amb això que fa que els posts només es puguin veure si s'ha fet loggin. video 47


const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower)
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower)

 
router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser); //el middleware nomes permet accedir al perfil de luser si s'ha fet signin

router.put("/user/:userId", requireSignin, updateUser); //el middleware nomes permet accedir al perfil de luser si s'ha fet signin
router.delete("/user/:userId", requireSignin, deleteUser); //el middleware nomes permet accedir al perfil de luser si s'ha fet signin
// la foto
router.get("/user/photo/:userId", userPhoto)

// qualsevol ruta que contingui :userID la app executarà primer userByID. 
router.param("userId", userById) 

module.exports = router;