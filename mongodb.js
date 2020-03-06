const chalk = require('chalk')

const { MongoClient, ObjectID } = require('mongodb')

const connectionUrl = `mongodb://127.0.0.1:27017`
const databaseName = `taskAppData`

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log(chalk.red("Unable to connect to the database"))
    }
    const db = client.db(databaseName)

    db.collection(`tasks`).deleteOne(
        {
            description: "get food"
        }
    )
    .then(console.log)
    .catch(console.log)
})

