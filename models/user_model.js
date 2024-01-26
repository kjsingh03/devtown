import { model, Schema } from 'mongoose'
import validator from 'validator'
import mongooseHidden from 'mongoose-hidden'


export const taskSchema = new Schema({
    title: { type: String, required: [true, "Please enter Title"]},
    id: { type: String },
    description: { type: String, required: [true, "Enter description"] },
    status:{type:String , enum:["todo","ongoing","completed","overdue"], required: [true, "Please enter Status"]},
    priority:{type:String , enum:["High","Medium","Low"], required: [true, "Please enter Priority"]},
    category:{type:String , enum:["personal","design","development","research"], required: [true, "Please enter Category"]},
    createdDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: [true, "Please enter Due Date"] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    username:{ type:String}
})

export const userSchema = new Schema({
    name: { type: String, required: [true, "Please enter Name"] },
    username: { type: String, required: [true, "Please enter Username"], unique: [true, "User already exists"],sparse:true},
    password: { type: String, required: [true, "Please enter Password"], minLength: [8, 'Password must be atleast 8 characters long'] },
    role: { type: String, default: "user" },
    token: { type: String },
    tasks: [{type: Schema.Types.ObjectId, ref: "Task"}]
})

userSchema.plugin(mongooseHidden(), { hidden: { _id: true, password: true, token: true, role: true } })

export const Task = model("Task", taskSchema)

export const User = model("User", userSchema)

