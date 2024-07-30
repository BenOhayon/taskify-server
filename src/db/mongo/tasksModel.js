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
    text: { 
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

function createNewTask(text, userId) {
    return new Promise((resolve, reject) => {
        taskModel.create({
            text,
            userId
        })
            .then(task => resolve(mongoResultToJson(task)))
            .catch(reject)
    })
}

async function deleteTask(taskId) {
    return mongoResultToJson(await taskModel.findByIdAndDelete(taskId))
}

async function updateTask(taskId, data) {
    const taskToUpdate = await taskModel.findById(taskId)
    taskToUpdate.text = data.text
    return taskToUpdate.save()
}

module.exports = {
    fetchAllTasks,
    fetchTaskById,
    createNewTask,
    updateTask,
    deleteTask
}