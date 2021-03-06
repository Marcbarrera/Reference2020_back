
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    category: String,
    target_content: String,
    reference_content: String,
    youtube_target: String,
    youtube_reference: String,
    photo1: {
        data: Buffer,
        contenType: String
    },
    photo2: {
        data: Buffer,
        contenType: String
    },
    photo_target: {
        data: Buffer,
        contenType: String
    },
    photo_reference: {
        data: Buffer,
        contenType: String
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: 'User' }
        }
    ]
});

module.exports = mongoose.model('Post', postSchema);