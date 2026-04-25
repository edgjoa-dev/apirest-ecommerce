import { Request, Response } from "express"
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";


export const getAllUsers = (req: Request, res: Response) => {
    const { limit = '10', page = '1', from = '1', to = '10' } = req.query


    return res.status(200).json({
        ok: true,
        msg: 'Get all users - from controller',
        limit,
        page,
        from,
        to
    })
}


export const getUser = (req: Request, res: Response) => {

    const { id } = req.params

    if (!id) {
        return res.status(400).json({
            ok: false,
            msg: 'Bad request - id is required'
        })
    }

    return res.status(200).json({
        ok: true,
        msg: 'Get user',
        id: id,

    })
}


export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // validar que email no exista
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already exists'
            })
        }

        //validar datos recibidos sean name, email y password
        if (!name.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({
                ok: false,
                msg: 'Bad request, name, email and password are required'
            })
        }

        // hashear
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //guardar usuario en mongoDB
        const user = new User({ name, email, password: hashedPassword });
        await user.save();


        //retornar rspuesta con usuario creado
        return res.status(200).json({
            ok: true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Internal server error - user not created'
        })
    }

}


export const updateUser = (req: Request, res: Response) => {
    return res.status(200).json({
        ok: true,
        msg: 'update user'
    })
}


export const deleteUser = (req: Request, res: Response) => {
    return res.status(200).json({
        ok: true,
        msg: 'delete user'
    })
}


