import { Schema, model } from 'mongoose'


const roleSchema = new Schema({

    role: {
        type: String,
        required: [true, 'The role is required'],
        unique: true,
    }

})

export const Role = model('Role', roleSchema);