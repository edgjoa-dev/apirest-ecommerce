import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";


const userSchema = new Schema<IUser>({
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        role:{
            type: String,
            required: true,
            default: 'USER_ROLE',
        },
        status:{
            type: Boolean,
            default: true,
        },
        google:{
            type: Boolean,
            default: false,
        },
        creaAt:{
            type: Date,
            default: Date.now(),
        },
});

export const User = model<IUser>('User', userSchema);


