const mongoose = require('mongoose')

//                mongodb://localhost ip   /dbname
mongoose.connect('mongodb://127.0.0.1:27017/taskAppApi', {
    useNewUrlParser: true,
    useCreateIndex: true
})


// const User = mongoose.model('User', {
//     name: {
//         type: String
//     },
//     age: {
//         type: Number
//     }
// })

// let me = new User({
//     name: "Anacan",
//     age: "ye"
// })

// me.save()
//     .then(console.log)
//     .catch(console.log)

let Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})


let homeworkTask = new Task({
    description: "Complete EE homework",
    completed: false
})

homeworkTask.save()
    .then(console.log)
    .catch(console.log)

