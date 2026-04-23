import { Request, Response } from "express"


export const getAllUsers = (req: Request, res: Response)=> {
    const { limit='10', page='1', from='1', to='10' } = req.query


    return res.status(200).json({
        ok: true,
        msg: 'Get all users - from controller',
        limit,
        page,
        from,
        to
    })
}

export const getUser = (req: Request, res: Response)=> {

    const {id} = req.params

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

export const createUser = (req: Request, res: Response)=> {
    const { name, email, password } = req.body;

    const user = {
        name,
        email,
        password
    }

    if(!name || !email || !password){
        return res.status(400).json({
            ok: false,
            msg: 'Bad request'
        })
    }


    return res.status(200).json({
        ok: true,
        user
    })
}

export const updateUser = (req: Request, res: Response)=> {
    return res.status(200).json({
        ok: true,
        msg: 'update user'
    })
}

export const deleteUser = (req: Request, res: Response)=> {
    return res.status(200).json({
        ok: true,
        msg: 'delete user'
    })
}


