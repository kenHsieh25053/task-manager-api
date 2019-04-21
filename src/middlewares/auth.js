const jwt = require('jsonwebtoken') // Import jsonwebtoken for generating jwtoken
const User = require('../models/users') // Import user module for saving user data

// Define authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECERT)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user

        next()

    } catch (e) {
        res.status(401).send({
            error: "Please authenticate."
        })
    }
}

module.exports = auth