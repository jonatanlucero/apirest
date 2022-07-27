import mongoose from "mongoose";
import {Schema, model} from mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: {unique: true},
    },
    password: {
        type: String,
        required: true,
    }
});
export const User = model("user", userSchema) //con el export lo exporto para poder usarlo en los otros archivos