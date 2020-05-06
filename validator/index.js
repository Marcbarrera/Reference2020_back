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
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError});
    }
    // següent middleware
    next();
};

exports.userSignupValidator = (req, res, next) => {
    // el nom no és null i entre 4-10 caracters
    req.check("name", "Name is required").notEmpty();
    //chequejar que email te @ i la seva longitud. faltaria al model posar lowercase
    req.check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max: 2000
    })

    //chequejar el password
    req.check("password", "Password is required").notEmpty;
    req.check('password')
    .isLength({min: 8})
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")

    //checkejar errors
    const errors = req.validationErrors()
    //if error show first one as they happen
    if(errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError});
    }
    // següent middleware
    next();
}