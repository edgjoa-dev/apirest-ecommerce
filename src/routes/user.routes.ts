import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controllers";
import { check } from "express-validator";
import { fieldsValidator } from "../middlewares";

const route = Router();


route.get('/', getAllUsers);

route.get('/:id', getUser);

route.post('/',[
    check('name', 'El nombre es requerido y debe ser mayor a 3 caracteres').isLength({ min: 3 }),
    check('email', 'Email es requerido, por favor válidar nuevamente').isEmail(),
    check('password', 'Password es requerido y debe ser al menos 10 caracteres').isLength({ min: 10 }),
    fieldsValidator
], createUser);

route.put('/:id', updateUser);

route.delete('/:id',  deleteUser);


export default route;