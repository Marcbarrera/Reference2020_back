const _ = require ('lodash')
const User = require ('../models/user');
const formidable = require('formidable')
const fs = require('fs');

exports.userById = (req, res, next, id) => {
    User.findById(id)
       // populate followers and following users array
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        req.profile = user // afegir el perfil al req amb la info de l'unsuari
        next();
    })
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
};

exports.allUsers = (req, res) => {
    User.find((err, users)=> {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json( users); // estrets els curly braces per a que el map dels usuaris funcioni al front end
    }).select("name email update created bio"); //important. Mostra nomes el que hi ha dins de select. Els altres camps dels users no es mostraran si no estan dins select
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined; //per a no mostrar la contraseña quan es fa get a un user concret i el mateix amb el salt.
    req.profile.salt = undefined;
    return res.json(req.profile)
}

// exports.updateUser = (req, res, next) => {
//     let user = req.profile
//     user = _.extend(user, req.body)
//     user.update = Date.now()
//     user.save((err) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action"
//             })
//         }
//         user.hashed_password = undefined; //per a no mostrar la contraseña quan es fa get a un user concret i el mateix amb el salt.
//         user.salt = undefined;
//         res.json({user})

//     })

// }

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        //guardar l'user
        let user = req.profile
        user = _.extend(user, fields)
        user.updated= Date.now()
    
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }
        user.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);

        })
    })
}

exports.userPhoto = (req, res, next) => {
    if(req.profile.photo.data){
        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data)
    }
    next();
}

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        
        res.json({ message: "User delete succesfully" });

    })
}

exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        {$push: {following: req.body.followId}},
        (err, result) => {
            if (err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.addFollower = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {$push: {followers: req.body.userId}},
        {new:true}
    )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    exec((err, result) => {
        if (err){
            return res.status(400).json({
                error: err
            })
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    })

}

exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        {$pull: {following: req.body.unfollowId}},
        (err, result) => {
            if (err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {$pull: {followers: req.body.userId}},
        {new:true}
    )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    exec((err, result) => {
        if (err){
            return res.status(400).json({
                error: err
            })
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    })

}