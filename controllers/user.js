import { User } from "../models/user_model.js";

export const getAllUsers = async (req, res) => {
    try {
        let users = await User.find();
        if (users) {
            users = await User.find().populate("tasks").exec()
            res.status(200).json(users);
        }
        else {
            res.status(404).json({ "success": false, "message": "Users not found" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch users" })
    }
}

export const getUser = async (req, res) => {
    try {
        const username = req.body.username;
        if (!username) {
            res.status(404).json({ "success": false, "message": "Enter username" })
        }
        else{
            let user = await User.findOne({ username: username });
            if (user) {
                user = await User.findOne().populate("tasks").exec()
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ "success": false, "message": "Users not found" })
            }
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to fetch users" })
    }
}

export const updateUser = async (req, res) => {
    try {
        const username = req.body.username;
        if (username) {
            let user = await User.findOne({ username: username })
            if (user) {
                user = await User.findOneAndUpdate({ username: username }, req.body, { returnDocument: 'after' });
                res.status(200).json(user);
            } else {
                res.status(404).json({ "success": false, "message": "User not found" });
            }
        } else {
            res.status(404).json({ "success": false, "message": "Please enter username" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to update User" })
    }
}

export const removeUser = async (req, res) => {
    try {
        const username = req.body.username;
        if (username) {
            let user = await User.findOne({ username: username })
            if (user) {
                user = await User.findOneAndDelete({ username: username }, req.body, { returnDocument: 'after' });
                res.status(200).json(user);
            } else {
                res.status(404).json({ "success": false, "message": "User not found" });
            }
        } else {
            res.status(404).json({ "success": false, "message": "Please enter username" })
        }
    } catch (err) {
        res.status(404).json({ "success": false, "message": "Failed to delete User" })
    }
}