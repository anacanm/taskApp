const mongoose = require('mongoose')

//                mongodb://localhost ip   /dbname
mongoose.connect('mongodb://127.0.0.1:27017/taskAppApi', {
    useNewUrlParser: true,
    useCreateIndex: true
})


// NOTE: saving a mongoose model will automatically create a collection with that data if one does not already exist
// for example, if you make a model with the identifier of "burner", and then .save() an object made of that model,
// mongoose will create and connect to a collection called "burners". Pretty cool