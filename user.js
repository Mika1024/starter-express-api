import mongoose from 'mongoose'

const User = new mongoose.Schema({
    fullName: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    number: {
        type: String, required: true, unique: true
    },
    passwordHash: {
        type: String, required: true
    },
    avatar: String,
},
{
    timestamps: true
}
)

export default mongoose.model('User', User)