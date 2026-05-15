import { Role } from "../models/role.model";

export const isRoleValid = async( role = '' )=> {

    const isRoleValid = await Role.findOne({ role });
    if (!isRoleValid) {
        throw new Error(`The role ${ role } is not valid`);
    }else{
        return true;
    }
}


