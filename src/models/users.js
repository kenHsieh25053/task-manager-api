const mongoose = require('mongoose') // Import mongoose module for manipulating mongodb
const validator = require('validator') // Import validator module for validating data
const bcrypt = require('bcryptjs') // Import bcryptjs for encrypting password
const jwt = require('jsonwebtoken') // Import jsonwebtoken for generating jwtoken
const Task = require('./tasks') // import Task model for user model referance

// Define user schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        // Validator for email format
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        // Validator for password value
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain 'password'")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        // Validator for age value
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a postive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// Set up relationship between users and tasks document
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Remove private information and send it back to user
userSchema.methods.toJSON = function () {
    const user = this
    // Get raw user data
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Assign generateAuthToken function to userSechema (apply to document)
userSchema.methods.generateAuthToken = async function () {
    const user = this
    // Use userid and jwt_secert to generateauthtoken
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECERT)
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

// Assign findByCredentials function to userSechema (apply to model)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Encrypt user password if it has been created or changed before saving in db
userSchema.pre('save', async function (next) {
    const user = this // this refers to user document
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete tasks which created by same user before removing user
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({
        owner: user._id
    })
    next()
})

// Create user model
const User = mongoose.model('User', userSchema)

module.exports = User