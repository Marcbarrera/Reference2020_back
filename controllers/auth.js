const jwt = require('jsonwebtoken');
require('dotenv').config()
const expressJwt = require ('express-jwt') // ojo amb això pq jo vull que els post es puguin veure sense fer signin VIDEO 47
const User = require ('../models/user');
const _ = require('lodash');




exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email})
    if(userExists) return res.status(403).json({
        error: "Email is taken"
    })
    const user = await new User(req.body)
    await user.save()
    res.status(200).json({ message: "Signup succes! Please login" });
}; 

exports.signin = (req, res ) => {
    //trobar l'user bassat en l'email
    const {email, password} =req.body
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(401).json({
                error: "User with that email does not exist. Please signup"
            })
        }
        //si es troba l'usuari, assegurar-se que email i password coincideixen
        //crear mètode d'autificació i fer-lo servir aquí.
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }
        // generar un token amb l'user id i el secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    //persistir amb tl token com a 't' q la cookie amb temps de expiració.
    res.cookie("t", token, {expire: new Date() + 9999})

    //retorn de la repsosta amb l'usuari i el token al front
    const {_id, name, email} = user
    return res.json({token, user:{_id, email, name}})

    });

};

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({message: "Signout succes!"})
}

exports.requireSignin = expressJwt({
    //si el token es valid , express jwt appends la userid verificada
    //a la auth key a l'object requerit
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});