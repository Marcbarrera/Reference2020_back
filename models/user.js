const mongoose =require ('mongoose');
var uuidv1 = require('uuidv1');
const crypto = require ('crypto');
const {ObjectId} = mongoose.Schema


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    last_name:{
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    following: [{type: ObjectId, ref:"User"}],
    followers: [{type: ObjectId, ref:"User"}],

    bio: {
        type: String,
        trim: true,
        default: ""

    },
    mini_description:{
        type: String,
        trim:true
    },
    genre:{
        type:String
    },
    facebook:{
        type: String,
        trim:true
    },
    twitter:{
        type: String,
        trim:true
    },
    instagram:{
        type: String,
        trim:true
    },
    youtube:{
        type: String,
        trim:true
    },
    Linkedin:{
        type: String,
        trim:true
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    }
});

// virtual field

userSchema.virtual('password')
.set(function(password){
    //crea un variable temporal anomenada _password
    this._password = password
    // genera un timestamp
    this.salt = uuidv1();
    //encriptar el password
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//mètodes

userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
        if(!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
        } catch (err){
            return ""

        }
    }
};

module.exports = mongoose.model("User", userSchema); 