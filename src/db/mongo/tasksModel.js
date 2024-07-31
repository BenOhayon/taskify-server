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
    }
})

const taskModel = mongoose.model('tasks', taskSchema)

async function fetchAllTasks(userId = "") {
    try {
        const searchFilter = userId === "" ? {} : { userId }
        const tasks = await taskModel.find(searchFilter)
        return mongoResultToJsonArray(tasks)
    } catch (err) {
        throw err
    }
}

function fetchTaskById(taskId) {
    return new Promise((resolve, reject) => {
        taskModel.findById(taskId)
            .then(task => resolve(mongoResultToJson(task)))
            .catch(reject)
    })
}

function createNewTask(title, description, userId) {
    return new Promise((resolve, reject) => {
        taskModel.create({
            title,
            description,
            userId
        })
            .then(task => resolve(mongoResultToJson(task)))
            .catch(reject)
    })
}

async function deleteTask(taskId) {
    return mongoResultToJson(await taskModel.findByIdAndDelete(taskId))
}

async function updateTask(taskId, title, description) {
    const taskToUpdate = await taskModel.findById(taskId)
    taskToUpdate.title = title
    taskToUpdate.description = description
    return taskToUpdate.save()
}

module.exports = {
    fetchAllTasks,
    fetchTaskById,
    createNewTask,
    updateTask,
    deleteTask
}