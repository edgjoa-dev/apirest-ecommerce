import { Request, Response } from "express"


export const getAllUsers = (req: Request, res: Response)=> {
    return res.status(200).json({
        ok: true,
        msg: 'Get all users - from controller'
    })
}

export const getUser = (req: Request, res: Response)=> {
    return res.status(200).json({
        ok: true,
        msg: 'Get user'
    })
}

export const createUser = (req: Request, res: Response)=> {
    return res.status(200).json({
        ok: true,
        msg: 'create user'
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


