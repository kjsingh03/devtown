import express from 'express'
import { Task } from '../models/user_model.js'
import { User } from '../models/user_model.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
const publicKey = fs.readFileSync(path.join(path.resolve(), './public.key'), "utf-8")


export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body
        if (title) {
            if (description) {
                if (dueDate) {
                    let task = await Task.findOne({ title: req.body.title });
                    if (!task) {
                        task = await new Task(req.body)
                        task.save()
                            .then(() => {
                                task.id = task.title.toLowerCase().replace(/ /g, "-");
                                const token = req.headers['authorization'];

                                jwt.verify(token, publicKey, async function (err, decoded) {
                                    let user = await User.findOne({ username: decoded.username })
                                    task.createdBy = user._id
                                    task.username = decoded.username;
                                    task.save()
                                        .then(() => { return res.status(200).json({ "Success": true, "message": "Task saved successfully", task }) })
                                        .catch((err) => { return res.status(404).json({ "Success": "false", "message": err.message }) })
                                    user = await User.findOneAndUpdate({ username: decoded.username }, { $push: { tasks: task } }, { new: true })
                                })
                            })
                            .catch((err) => { return res.status(404).json({ "Success": "false", "message": err.message }) })
                    }
                    else {
                        return res.status(404).json({ "Success": "false", "message": "Task already exist" })
                    }
                }
                else {
                    return res.status(404).json({ "Success": "false", "message": "Please enter Due Date" })
                }
            }
            else {
                return res.status(404).json({ "Success": "false", "message": "Please enter Description" })
            }
        }
        else {
            return res.status(404).json({ "Success": "false", "message": "Please enter Title" })
        }
    } catch (error) {
        return res.status(404).json({ "Success": "false", "message": error })
    }
}

export const getTask = async (req, res) => {
    try {
        const id = req.params.id;
        let task = await Task.findOne({ id: id })
        if (task) {
            task = await Task.findOne({ id: id })
                .exec()
            return res.status(200).json({ "Success": true, "message": "Task saved successfully", task })
        }
        else {
            res.status(404).json({ "success": false, "message": "Task not found" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch task" })
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        jwt.verify(token, publicKey, async function (err, decoded) {
            const username = decoded.username;
            let user = await User.findOne({ username: username })
            if (user) {
                user = await User.findOne({ username: username }).populate("tasks").exec()
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ "success": false, "message": "Users not found" })
            }
        })
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch users" })
    }
}

export const getTaskStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const token = req.headers['authorization'];
        jwt.verify(token, publicKey, async function (err, decoded) {
            const username = decoded.username;
            let user = await User.find({ username: username })
            if (user) {
                let tasks = await Task.find({ $and: [{ username: username }, { status: status }] })
                res.status(200).json(tasks);

            }
            else {
                res.status(404).json({ "success": false, "message": "Users not found" })
            }
        })
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch users" })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body
        if (title) {
            if (description) {
                if (dueDate) {
                    const id = req.params.id;
                    let task = await Task.findOne({ id: id })
                    if (task) {
                        task = await Task.findOneAndUpdate({ id: id }, req.body, { returnDocument: 'after' })
                        task.id = task.title.toLowerCase().replace(/ /g, "-");
                        task.save()
                            .then(() => { return res.status(200).json({ "Success": true, "message": task }) })
                            .catch((err) => { return res.status(404).json({ "Success": "false", "message": "Failed to save task", "error": err.message }) })
                    }
                    else {
                        res.status(404).json({ "success": false, "message": "Task not found" })
                    }
                }
                else {
                    return res.status(404).json({ "Success": "false", "message": "Please enter Due Date" })
                }
            }
            else {
                return res.status(404).json({ "Success": "false", "message": "Please enter Description" })
            }
        }
        else {
            return res.status(404).json({ "Success": "false", "message": "Please enter Title" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch task" })
    }
}

export const removeTask = async (req, res) => {
    try {
        const id = req.params.id;
        let task = await Task.findOne({ id: id });
        if (task) {
            task = await Task.findOneAndDelete({ id: id }, req.body, { returnDocument: 'after' })
            res.status(200).json({ "Success": true, "message": task })
        }
        else {
            res.status(404).json({ "success": false, "message": "Task not found" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch task" })
    }
}


