//títol

exports.createPostValidator = (req, res, next) => {
    req.check('title', "Write a title").notEmpty();
    req.check('title', "Title must be between 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });



//body

    req.check('body', "Write a body").notEmpty();
    req.check('body', "body must be between 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });
    // mirar errors
    const errors = req.validationErrors()
    //if error show first one as they happen
    if(errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError});
    }
    // següent middleware
    next();
};