const express = require('express')
require('./db/mongoose') //this executes the mongoose.js file, which connects mongoose to the database

const { User } = require('./models/user')
const { Task } = require('./models/task')

const chalk = require('chalk')


const app = express();

const PORT = (process.env.PORT || 3000)


app.use(express.json())



app.get('/users', (req, res) => {     //sending a get request to the users endpoint will return all users from the database
    User.find({})  //using an empty object as the filter will return all documents in the users collection in the database
        .then(users => res.send(users))
        .catch(() => res.status(500).send())
})

app.get('/users/id/:id', (req, res) => {    //:id acts as a dynamic route
    User.findById(req.params.id)             //req.params has the route parameter that gets provided in the form of an object with the property "id"
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
})



app.get('/tasks', (req, res) => {    //returns all tasks
    Task.find({})
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
})

app.get('/tasks/id/:id', (req, res) => {      //returns the specified task
    Task.findById(req.params.id)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
})


app.get('/tasks/incomplete', (req, res) => {  //returns the tasks that are incomplete
    Task.find({ completed: false })
        .then(task => res.status(200).send(task))
        .catch(err => res.status(500).send(err))
})


//if the user wants to create data, they would be posting it. 
//req = request(requesting from the server)
//res = respond(responding to the client)
app.post('/users', (req, res) => {    //when a user posts information to the server
    const user = new User(req.body) //make a new user with the data posted

    user.save()                //saves the user to the database
        .then(() => res.status(201).send(user))  //sends the user to the client
        .catch(err => res.status(400).send(err)) //if there is an error, update the status to 400, and send the error
})


app.post('/tasks/add', (req, res) => {    //adds a task to the db specified by the body
    const task = new Task(req.body)

    task.save()
        .then(() => res.status(201).send(task))
        .catch(err => res.status(400).send(err))
})


app.patch('/users/update/:id', async (req, res) => {     // sets document specified by the id to req.body (what data is sent to the endpoint)
    try {
        const acceptedUpdates = ["name", "email", "age", "password"]
        const updates = Object.keys(req.body)
        const isValid = updates.every(update => acceptedUpdates.includes(update))

        if(!isValid){
            return res.status(400).send({ error: "Nonvalid updates"})
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            res.status(404).send()
        }
        else {
            res.status(200).send(user)
        }
    }
    catch (err) {
        res.status(400).send(err)
    }
})


app.patch('/tasks/update/:id', async (req, res) => { //completes a task specified by id
    try {
        const acceptedUpdates = ["description", "completed"]
        const updates = Object.keys(req.body)
        const isValid = updates.every(update => acceptedUpdates.includes(update))

        if(!isValid){
            return res.status(400).send({ error: "Nonvalid updates"})
        }

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) //the new option will specify that findByIdAndUpdate should return the modified user
        if(!task){
            res.status(404).send()
        }
        else {
            res.status(200).send(task)
        }
    }
    catch (err) {
        res.status(400).send(err)
     }
})



app.delete('/tasks/delete/:id', (req, res) => {    //deletes task by id
    Task.findByIdAndDelete(req.params.id)
        .then(data => res.status(200).send(data))
})

app.listen(PORT, () => {
    console.log(chalk.green("Server listening on"), chalk.yellow(PORT))
})