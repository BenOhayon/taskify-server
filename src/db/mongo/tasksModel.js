const mongoose = require('mongoose');
const {
    mongoResultToJson,
    mongoResultToJsonArray
} = require('../../mongoUtils')

const taskSchema = new mongoose.Schema({
    created_at: { 
        type: Number, 
        required: true, 
        immutable: true, 
        default: () => new Date().getTime() 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
        default: false
    }
})

const taskModel = mongoose.model('tasks', taskSchema)

async function fetchAllTasks(userId = "") {
    const searchFilter = userId === "" ? {} : { userId }
    const tasks = await taskModel.find(searchFilter)
    return mongoResultToJsonArray(tasks)
}

async function fetchTaskById(taskId) {
    return mongoResultToJson(await taskModel.findById(taskId))
}

async function createNewTask(title, description, userId) {
    return mongoResultToJson(await taskModel.create({ title, description, userId }))
}

async function deleteTask(taskId) {
    return mongoResultToJson(await taskModel.findByIdAndDelete(taskId))
}

async function updateTask(taskId, title, description, done) {
    const taskToUpdate = await taskModel.findById(taskId)
    taskToUpdate.title = title
    taskToUpdate.description = description
    taskToUpdate.done = done
    return taskToUpdate.save()
}

module.exports = {
    fetchAllTasks,
    fetchTaskById,
    createNewTask,
    updateTask,
    deleteTask
}