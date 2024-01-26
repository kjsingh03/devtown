import express from 'express'
import { Task, User } from '../models/user_model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'

const privateKey = fs.readFileSync(path.join(path.resolve(), './private.key'), "utf-8")

export const signup = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        if (name) {
            if (username) {
                if (password) {
                    if (password.length >= 8) {
                        let user = await User.findOne({ username: req.body.username })
                        if (!user) {
                            user = await new User(req.body)
                            user.save()
                                .then(() => {
                                    bcrypt.genSalt(10, function (err, salt) {
                                        bcrypt.hash(user.password, salt, function (err, hash) {
                                            user.password = hash;
                                            user.save()
                                        });
                                    });
                                })
                                .then(() => {
                                    const task = new Task({
                                        "title": "Welcome to Taskmate",
                                        "description": "Start adding tasks now ",
                                        "dueDate": new Date(),
                                        "status": "todo",
                                        "priority": "High",
                                        "category": "personal"
                                    })
                                    task.save()
                                        .then(async () => {
                                            task.id = task.title.toLowerCase().replace(/ /g, "-");
                                            task.createdBy = user._id
                                            task.username = username;
                                            user = await User.findOneAndUpdate({ username: username }, { $push: { tasks: task } }, { new: true })
                                            task.save()
                                                .then(() => { return res.status(201).json({ "Success": "true", "message": "Account created successfully" }) })
                                                .catch((err) => { return res.status(404).json({ "Success": "false", "message": "Failed to create user", "error": err.message }) })
                                        })
                                })
                        }
                        else {
                            return res.status(404).json({ "Success": "false", "message": "User already Exist" })
                        }
                    }
                    else {
                        return res.status(404).json({ "Success": "false", "message": "Password length must be greater than 8" })
                    }
                }
                else {
                    return res.status(404).json({ "Success": "false", "message": "Please enter Password" })
                }
            } else {
                return res.status(404).json({ "Success": "false", "message": "Please enter Username" })
            }
        }
        else {
            return res.status(404).json({ "Success": "false", "message": "Please enter Name" })
        }
    } catch (error) {
        return res.status(404).json({ "Success": "false", "message": error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username) {
            if (password) {
                let user = await User.findOne({ username: username })
                if (user) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (result) {
                            if (user) {
                                var token = jwt.sign({ username: user.username }, privateKey, { algorithm: 'RS256' });
                                user.token = token;
                                user.save()
                                    .then(() => { return res.status(201).json({ "Success": "true", "message": "User logged in successfully", token: token }) })
                                    .catch((err) => { return res.status(201).json({ "Success": "false", "message": "Failed to login", "error": err.message }) })

                            }
                            else {
                                return res.status(404).json({ "Success": "false", "message": "Enter valid username/Password" })
                            }
                        }
                        else {
                            return res.status(404).json({ "Success": "false", "message": "Please enter valid Password" })
                        }
                    });
                }
                else {
                    return res.status(404).json({ "Success": "false", "message": "User Not found" })
                }
            } else {
                return res.status(404).json({ "Success": "false", "message": "Please enter password" })
            }

        } else {
            return res.status(404).json({ "Success": "false", "message": "Please enter username" })
        }

    } catch (error) {
        return res.status(404).json({ "Success": "false", "message": error.message })
    }
}

export const logout = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username })
        if (user) {
            user.token = "";
            user.save()
                .then(() => { res.status(201).json({ "Success": "true", "message": "User logged out successfully" }) })
                .catch((err) => { res.status(201).json({ "Success": "false", "message": "Failed to log out", "error": err.message }) })

        }
        else {
            return res.status(404).json({ "Success": "false", "message": "User not found" })
        }
    } catch (error) {
        return res.status(404).json({ "Success": "false", "message": error.message })
    }
}


