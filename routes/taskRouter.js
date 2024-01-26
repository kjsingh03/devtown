import { Router } from 'express'
import { createTask, getAllTasks, getTaskStatus, getTask, removeTask, updateTask } from '../controllers/task.js';

const taskRouter = Router();

taskRouter
    .post("/", createTask)
    .get('/', getAllTasks)
    .get('/status/:status',getTaskStatus)
    .get('/:id', getTask)
    .put("/:id", updateTask)
    .delete('/:id', removeTask)

export default taskRouter