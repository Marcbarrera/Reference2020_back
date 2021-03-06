const Post = require ('../models/post');
const formidable = require('formidable')
const fs = require('fs')
const _ = require ('lodash')


exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("postedBy", "_id name")
        .exec((err, post) => {
            if (err|| !post) {
                return res.status(400).json({
                    error: err

                });
            }
            req.post = post;
            next();
        })
};

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .select("_id title body created category target_content photo_target likes")
        .sort({ created: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};

exports.getTopPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .select("_id title body created category target_content photo_target likes")
        .sort( { created: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};

// exports.createPost = (req, res, next) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true
//     form.parse(req, (err, fields, files) => {
//         if(err) {
//             return res.status(400).json({
//                 error: "Image could not be uploaded"
//             })
//         }
//         let post = new Post (fields);

//         req.profile.hashed_password = undefined; //per a no mostrar la contraseña quan es fa get a un user concret i el mateix amb el salt.
//         req.profile.salt = undefined; //aqui estava l'error
//         post.postedBy = req.profile

//         if(files.photo){
//             post.photo.data = fs.readFileSync(files.photo.path);
//             post.photo.contentType = files.photo.type;
//         }
//         post.save((err, result) => {
//             if(err) {
//                 return res.status(400).json({
//                     error: err // aqui també estava l'error
//                 })
//             }
//             res.json(result);
//         })
//     })
//     // const post = new Post(req.body);
//     // post.save()
//     // .then(result => {
//     //     res.json({
//     //         post: result
//     //     });
//     // });
// };

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    console.log(form)
    console.log(req.body)
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo1)  {
            post.photo1.data = fs.readFileSync(files.photo1.path);
            post.photo1.contentType = files.photo1.type;
        }
        if (files.photo2) {
            post.photo2.data = fs.readFileSync(files.photo2.path);
            post.photo2.contentType = files.photo2.type;
        }
        if (files.photo_target) {
            post.photo_target.data = fs.readFileSync(files.photo_target.path);
            post.photo_target.contentType = files.photo_target.type;
        }
        if (files.photo_reference) {
            post.photo_reference.data = fs.readFileSync(files.photo_reference.path);
            post.photo_reference.contentType = files.photo_reference.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.addPhoto = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        post.photo1.data = fs.readFileSync(files.preorder.path);
        post.photo1.contentType = files.preorder.type;
       console.log(files.preorder)
       res.status(200).json({image: files.preorder})
    });

    // });
};



exports.postsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
        .populate("postedBy", "_id name")
        .select('_id title body created likes')
          .sort("_created")
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        })
}

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster){
        return res.status(403).json({
            error: "User is not authorized"
        });
    } next();
};

exports.updatePost = (req, res, next) => {
    let post = req.post
    post = _.extend(post, req.body)
    post.update = Date.now()
    post.save(err => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(post);
        
    })
}

exports.deletePost = (req, res) => {
    let post = req.post
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: "Post deleted successfully"
        })
    })
}

exports.photo1 = (req, res, next) => {
    res.set("Content-Type", req.post.photo1.contentType);
    return res.send(req.post.photo1.data);
};

exports.photo2 = (req, res, next) => {
    res.set("Content-Type", req.post.photo2.contentType);
    return res.send(req.post.photo2.data);
};

exports.photo_target = (req, res, next) => {
    res.set("Content-Type", req.post.photo_target.contentType);
    return res.send(req.post.photo_target.data);
};

exports.photo_reference = (req, res, next) => {
    res.set("Content-Type", req.post.photo_reference.contentType);
    return res.send(req.post.photo_reference.data);
};

exports.singlePost = (req, res) => {
    return res.json(req.post);
};

exports.like = (req,res) => {
    Post.findByIdAndUpdate(
        req.body.postId, 
        { $push: { likes: req.body.userId }},
        {new: true}
        ).exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json(result);
            }
        })
}

exports.unlike = (req,res) => {
    Post.findByIdAndUpdate(
        req.body.postId, 
        { $pull: { likes: req.body.userId }},
        {new: true}
        ).exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json(result);
            }
        })
}