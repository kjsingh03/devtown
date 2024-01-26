import { Router } from 'express'
import { getAllUsers, getUser, removeUser, updateUser } from '../controllers/user.js';

const userRouter = Router();

userRouter
    .get('/all', getAllUsers)
    .get('/', getUser)
    .put("/", updateUser)
    .delete('/', removeUser)

export default userRouter