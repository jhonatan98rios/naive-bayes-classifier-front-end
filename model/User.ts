import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email id required"]
    },
    name: {
        type: String,
        required: [true, "Email id required"]
    },
    image: {
        type: String,
    },
})