import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controllers";

const route = Router();


route.get('/', getAllUsers);

route.get('/:id', getUser);

route.post('/', createUser);

route.put('/:id', updateUser);

route.delete('/:id',  deleteUser);


export default route;