const express = require('express') // Import express module
const User = require('../models/users') // Import user module for saving user data
const auth = require('../middlewares/auth') // Import auth middleware for user authentication
const {
    sendWelcomeEmail,
    sendCancelEmail
} = require('../email/account') // Import send email module for welcome and cancel email

const router = express.Router() // Set up router for api endpoint

const multer = require('multer') // Import multer for dealing with image
const sharp = require('sharp') // Import sharp for cropping 

// Set up image upload size and types
const upload = multer({
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return new cb(new Error('Please upload right format image'))
        }
        cb(undefined, true)
    }

})

// Send a user info back to browser
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Send user avatar back to browser
router.get('/users/:id/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // Check user or user avatar has existed or not
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        // Send 404 not found to browser
        res.status(404).send(e)
    }
})

// Create user and send user info to server and save it in mongo db
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        // Send 201 Created and data to browser
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        // Send 400 bad request to browser
        res.status(400).send(e)
    }
})

// Send user login info (email, password) to server
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            uesr: user,
            token: token
        })
    } catch (e) {
        // Send 400 bad request to browser
        res.status(400).send()
    }
})

// Delete user's token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        // Send 500 Internal server error to browser
        res.status(500).send()
    }
})

// Delete all user's tokens
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // Replace all user tokens with an empty array
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        // Send 500 Internal server error to browser
        res.status(500).send()
    }
})

// Send user's avatar to server
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Save cropped image as a binary type
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    // Send 400 bad request to browser
    res.status(400).send({
        error: error.message
    })
})

// Send updated user info to server
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'age']
    // Validate update info before save in mongo db
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))

    if (!isValidOperation) {
        // Send 400 bad request to browser
        return res.status(400).send({
            error: "Invaild updates!"
        })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        // Send 500 Internal server error to browser
        res.status(500).send(e)
    }
})

// delete user's info 
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        // Send 500 Internal server error to browser
        res.status(500).send()
    }
})

// Delete user's avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    // Set avatar as underfined
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports = router