import { User } from "../models/user.model";

export const existEmail = async( email: string ) => {
    // validar que email no exista
    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error(`The email ${ email } already exists`);
    }else{
        return true;
    }
}
