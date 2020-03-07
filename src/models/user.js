const mongoose = require('mongoose')
const validator = require('validator')
const chalk = require('chalk')


const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(chalk.red("Email must be a valid email address"))
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error(chalk.red("Age must be a positive number"))
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error(chalk.red("Password must be at least 6 characters long"))
            }
            if (value.toLowerCase().includes('password')) {
                throw new Error(chalk.red("Password cannot contain the word 'password'"))
            }
        }
    }
})



module.exports = {
    User: User
}