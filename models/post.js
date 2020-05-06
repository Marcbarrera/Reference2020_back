const mongoose =require ('mongoose')
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: "true",
        
    },
    body: {
        type: String,
        required: "true",
    
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },// Aqui és on es dur a terme el populate. La relacio entre els posts i els usuaris
    
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", postSchema);
