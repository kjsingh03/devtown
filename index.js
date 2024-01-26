import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import 'dotenv/config'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import taskRouter from './routes/taskRouter.js'
const publicKey = fs.readFileSync(path.join(path.resolve(), './public.key'), "utf-8")

// Creating Server

const app = express();
const PORT = process.env.PORT || 8080;

// Connecting MongoDB 

main()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.Mongo_URL);
}

// Middlewares

app.use(cors())
    .use(express.json())
    .use("/",express.static('dist'))
    .use("/auth", authRouter)
    .use((req, res, next) => {
        try {
            const token = req.headers.authorization;
            jwt.verify(token, publicKey, function (err, decoded) {
                if (decoded.username) {
                    next()
                } else {
                    res.status(401).json({ success: false, message: "Please login to access" });
                }
            })
        }
        catch (err) {
            res.status(401).json({ success: false, message: "Please login to access" });
        }
    })
    .use("/users", userRouter)
    .use("/task", taskRouter)

// Listening Server

app.listen(PORT, () => {
    console.log(`Server is working at http://localhost:${PORT}`)
})