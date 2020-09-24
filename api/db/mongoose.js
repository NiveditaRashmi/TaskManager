//This file will will handle connection logic to the MongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//connecting database
mongoose.connect('mongodb://localhost:27017/TaskManager');
//on connection
mongoose.connection.on('connected', () =>{
    console.log('Connected to database mongodb @27017');
});

mongoose.connection.on('error', (err) => {
    if(err)
    {
        console.log('Error in Database connection:'+err);
    }
});
// mongoose.connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true}).then(() => {
//     console.log('Connected to MongoDB successfully :)');
// }).catch((err) => {
//     console.log("Error while atttempting to connect to MondoDB");
//     console.log(e);
// });

// To prevent deprecation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
};