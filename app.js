const express = require ('express');
const app = express();
const mongoose = require("mongoose");
const morgan = require ('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const expressValidator = require('express-validator');
const dotenv = require ('dotenv');
dotenv.config();


mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('DB connected'))
.catch(err => console.log('DB CONNECTION ERROR: ', err));


// aqui van les rutes
const postRoutes = require ('./routes/post')
const authRoutes = require ('./routes/auth')
const userRoutes = require ('./routes/user')



// midlewares

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

app.use(function(err, req, res, next){ //ojo! error per si no s'ha fet signin abans de crear un post
    if (err.name === "UnauthorizedError") {
        res.status(401).json({error: "Unauthorized"});
    }
})


const port = process.env.PORT || 8080;
app.listen(port);