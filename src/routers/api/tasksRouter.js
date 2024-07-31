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

/**
 * Fetches all the tasks of a user whose ID is 'userId'. If no ID was specified, it fetches all the tasks.
 * [GET] /api/tasks
 * 
 * Query Parameters:
 * @param userId - The ID of the user
 * 
 * For more info and testing, see {@link http://localhost:3000/api/docs}
 */
router.get("/", (req, res) => {
    const { userId } = req.query
    fetchAllTasks(userId ?? "")
        .then(tasks => res.json(new ServerDataResponse(responseCodes.OK, tasks.map(task => task)).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Oops... something went wrong when fetching tasks - ${error}`)
                .generateResponseJson()
        ))
})

/**
 * Creates a task.
 * [POST] /api/tasks
 * 
 * Body Parameters:
 * @param title - The title of the new task
 * @param description - The description of the new task
 * @param userId - The ID of the user created the task
 * 
 * For more info and testing, see {@link http://localhost:3000/api/docs}
 */
router.post("/", (req, res) => {
    const { title, description, userId } = req.body
    createNewTask(title, description, userId)
        .then(task => res.json(new ServerDataResponse(responseCodes.CREATED, task).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson()
        ))
})

router
    .route("/:id")
    /**
     * Fetches a task.
     * [GET] /api/tasks/:id
     * 
     * Path Parameters:
     * @param id - The ID of the requested task
     * 
     * For more info and testing, see {@link http://localhost:3000/api/docs}
     */
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
    /**
     * Updates a task.
     * [PUT] /api/tasks/:id
     * 
     * Path Parameters:
     * @param id - The ID of the requested task
     * 
     * Body Parameters:
     * @param title - The title of the requested task
     * @param description - The description of the requested task
     * 
     * For more info and testing, see {@link http://localhost:3000/api/docs}
     */
    .put((req, res) => {
        const { id } = req.params
        const { title, description } = req.body
        updateTask(id, title, description)
            .then(_ => res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, {}).generateResponseJson()))
            .catch(error => res.status(responseCodes.SERVER_ERROR).json(new ServerDataResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson())
            )
    })
    /**
     * Deletes a task.
     * [DELETE] /api/tasks/:id
     * 
     * Path Parameters:
     * @param id - The ID of the requested task
     * 
     * For more info and testing, see {@link http://localhost:3000/api/docs}
     */
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
