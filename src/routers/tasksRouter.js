const express = require("express");
const router = express.Router();
const { 
    fetchAllTasks,
    createNewTask,
    deleteTask,
    fetchTaskById,
    updateTask,
    fetchTasksByProps
} = require("../db/mongo/tasksModel");
const responseCodes = require('../responseCodes')
const ServerErrorResponse = require('../models/ServerErrorResponse')
const ServerDataResponse = require('../models/ServerDataResponse');

router.get("/", (req, res) => {
    const { userId } = req.query
    fetchAllTasks(userId)
        .then(tasks => res.json(new ServerDataResponse(responseCodes.OK, tasks.map(task => task)).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Oops... something went wrong when fetching tasks - ${error}`)
                .generateResponseJson()
        ))
})

router.post("/", (req, res) => {
    const { text } = req.body
    createNewTask(text)
        .then(task => res.json(new ServerDataResponse(responseCodes.CREATED, task).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson()
        ))
})

router
    .route("/:id")
    .get((req, res) => {
        fetchTaskById(req.params.id)
            .then(task => {
                if (!task) {
                    res.status(responseCodes.NOT_FOUND).json(new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - no task was found`))
                }
                res.json(new ServerDataResponse(responseCodes.OK, task).generateResponseJson())
            })
            .catch(error => res.json(
                new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                    .generateResponseJson())
            )
    })
    .put((req, res) => {
        updateTask(req.params.id, req.body)
            .then(_ => res.json(new ServerDataResponse(responseCodes.OK, {}).generateResponseJson()))
            .catch(error => res.json(new ServerDataResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson())
            )
    })
    .delete((req, res) => {
        deleteTask(req.params.id)
            .then(deletedTask => res.json(new ServerDataResponse(responseCodes.OK, deletedTask).generateResponseJson()))
            .catch(error => res.json(
                new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                    .generateResponseJson())
            )
    })

module.exports = router
