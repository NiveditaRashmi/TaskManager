const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();

const {mongoose}  = require('./db/mongoose');

// Load in the mongoose models
const { List } = require('./db/models/list.model');
const { Task } = require('./db/models/task.model');

// Load middleware
app.use(bodyParser.json());
app.use(cors());

//CORS HEADERS MIDDLEWARE
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

// Route Handlers


// List Routes

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // returns an array of all the lists in the database
    List.find({}).then((lists) => {
        res.send(lists);
    });
});

app.get('/lists/:listId/tasks/:taskId', (req, ress) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
})


/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    //We want to create a new list and return the list document back to the user(which includes the id)
    //the list information (fields) will be passed in via the JSON request body.
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (include id)
        res.send(listDoc);
    })
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res)=> {
    //We want  to update the list(list document with id in the URL) with new values
    //specidfied in the JSON body of the request.
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});

app.get('/lists/:listId/tasks', (req, res) => {
//    We wantt to return all tasks that belong to specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
})

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    })
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
})
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})