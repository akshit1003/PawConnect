import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    emailId: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);

export {User};