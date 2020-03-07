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
        .then( data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
})



app.get('/tasks', (req, res) => {
    Task.find({})
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
})

app.get('/tasks/id/:id', (req, res) => {
    Task.findById(req.params.id)
        .then(data => res.status(200).send(data))
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


app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save()
        .then(() => res.status(201).send(task))
        .catch(err => res.status(400).send(err))
})




app.listen(PORT, () => {
    console.log(chalk.green("Server listening on"), chalk.yellow(PORT))
})