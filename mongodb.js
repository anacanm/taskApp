//create read update delete

const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const connectionUrl = `mongodb://127.0.0.1:27017`

const databaseName = `taskAppData`

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error,client) => {
    if(error){
        console.log("Unable to connect to the database")
    }
    else {
        console.log("Connected succesffuly")
    }
    
})

