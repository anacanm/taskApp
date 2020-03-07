const express = require('express')
require('./db/mongoose') //this executes the mongoose.js file, which connects mongoose to the database

const { userRouter } = require('./routers/userRouter');
const { taskRouter } = require('./routers/taskRouter');

const chalk = require('chalk');

const app = express();

const PORT = (process.env.PORT || 3000);

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);


app.listen(PORT, () => {
    console.log(chalk.green("Server listening on"), chalk.yellow(PORT));
})