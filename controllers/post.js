const Post = require ('../models/post')
exports.getPosts = (req, res) => {
    res.json({
        posts: [
            {title: 'First post'}, {title: "Second post"}
        ]
    });
};

exports.createPost = (req, res) => {
    const post = new Post(req.body)
    console.log("CREATING POST: ", post);
};
