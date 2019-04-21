const express = require('express') // Import express module
const router = express.Router() // Set up router
const auth = require('../middlewares/auth') // Import auth middleware
const Task = require('../models/tasks') // Import task model


router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    // Get completed/uncompleted tasks value
    if (req.query.completed) {
        match.completed = req.query.completed === 'true' // true or false result
    }

    // Get desc/asc tasks value
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? 1 : -1
    }
    try {
        // Get users' tasks
        await req.user.populate({
            path: 'tasks',
            match,
            // Get limit or skip value for tasks pagination
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }

})

// get task by id 
router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// Send task to server
router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        // Assign an userid to the task
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update task data by id
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invaild updates!"
        })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.send(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router