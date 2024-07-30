const express = require("express");
const router = express.Router();
const { 
    fetchAllTasks,
    createNewTask,
    deleteTask,
    fetchTaskById,
    updateTask
} = require("../../db/mongo/tasksModel");
const responseCodes = require('../../responseCodes')
const ServerErrorResponse = require('../../models/ServerErrorResponse')
const ServerDataResponse = require('../../models/ServerDataResponse');

router.get("/", (req, res) => {
    const { userId } = req.query
    fetchAllTasks(userId ?? "")
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
        const { id } = req.params
        fetchTaskById(id)
            .then(task => {
                if (!task) {
                    res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, {}).generateResponseJson())
                } else {
                    res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, task).generateResponseJson())
                }
            })
            .catch(error => res.status(responseCodes.SERVER_ERROR).json(
                new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                    .generateResponseJson())
            )
    })
    .put((req, res) => {
        const { id, body } = req.body
        updateTask(id, body)
            .then(_ => res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, {}).generateResponseJson()))
            .catch(error => res.status(responseCodes.SERVER_ERROR).json(new ServerDataResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson())
            )
    })
    .delete((req, res) => {
        const { id } = req.params
        deleteTask(id)
            .then(deletedTask => res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, deletedTask).generateResponseJson()))
            .catch(error => res.status(responseCodes.SERVER_ERROR).json(
                new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                    .generateResponseJson())
            )
    })

module.exports = router
