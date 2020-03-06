const mongoose = require('mongoose')
const validator = require('validator')
const chalk = require('chalk')

//                mongodb://localhost ip   /dbname
mongoose.connect('mongodb://127.0.0.1:27017/taskAppApi', {
    useNewUrlParser: true,
    useCreateIndex: true
})


// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error(chalk.red("Email must be a valid email address"))
//             }
//         }

//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error(chalk.red("Age must be a positive number"))
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         validate(value) {
//             if (value.length < 6) {
//                 throw new Error(chalk.red("Password must be at least 6 characters long"))
//             }
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error(chalk.red("Password cannot contain the word 'password'"))
//             }
//         }
//     }
// })

// let me = new User({
//     name: "Anacan",
//     email: "burner@gmail.com",
//     password: "yee-haw"
// })

// me.save()
//     .then(console.log)
//     .catch(console.log)





let Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})


let homeworkTask = new Task({
    description: "Complete EE homework",
})

homeworkTask.save()
    .then(console.log)
    .catch(console.log)

