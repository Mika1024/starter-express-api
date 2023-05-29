import mongoose from 'mongoose'

const post = new mongoose.Schema({
    name: {
        type: String
    },
    text: {
        type: String
    },
    countSee: { 
        type: Number, required: true
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('post', post)