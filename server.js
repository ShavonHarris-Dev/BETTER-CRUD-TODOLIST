const express = require('express')
// express is an unopinated framework that lets you handle multiple differennt http requests at a specific URL
const app = express()
// a variable that allows us to use express
const MongoClient = require('mongodb').MongoClient
// a node js library that handles connecting to the mongo database
const PORT = 2100
// our server port
require('dotenv').config()
// a lightweight npm package that allows you to seperate secrets from your source code


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    // connecting database to env file and naming database
    // i'm not sure what else this means

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
// connecting to the mongo database
// useUnified Topology is false by default and we set it to true to opt into using the Mongo DB drivers new connection management engine
// MongoClient.connect returns a promise
// takes a connection url for MongoDB and optional options for insert commands
    
app.set('view engine', 'ejs')
// view engine helpful for rendering web pages. Used with EJS or embedded javascript which is a templating language that lets its user generate HTML with plain javascript.
app.use(express.static('public'))
//this is middleware that makes it possible that makes it possible to access files from the public folder via HTTP (Hyper Text Transfer Protocol)

// HTTP is a protocol for fetching resources such as HTML documents. It is the foundation of any data exchange on the web. data is encoded and transferred between a client and a server.

app.use(express.urlencoded({ extended: true }))
// this takes the place of body parser. Middleware that parses incoming requests built to recognize the incoming Request Object as strings or arrays.

//extended:true allows you to choose the qs library and allows for a richer JSON-like experience.
app.use(express.json())
// built to recognize the incoming data  as a JSON object

// express.json() and express.urlencoded is specifically for put and post requests you do need them for get and delete. In both of these requests you are sending data (get and put) and asking the server to accept or store that data which is enclosed in the in the body of that (post or put) request.

// a template engine allows you to use static files in your application. at runtime the template engine replaces variables in a template file with actual values and transforms the template into an HTML file sent to the client





// app.get('/')
// db.collection('todos')
// .find().toArray()
// render ejs
// respond with html

app.get('/',async (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})


// creating individual items 
//add.post('/action')
// text 
// complete
// reload

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// click on thing 
// js has an event listener
// event listener has a fetch
// fetch is a put and it sends the thing (get bread is the example task)
// put goes to server
// app.put heres that request
// goes to the db finds the collection('todos')
// uses update one method to update the text 
// it changes the completed value to true
// reload (get)
// goes to the db 
// if the document has a completed property of true we had the completed or we dont.

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // if there are two things that are the same grab the first one
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})





app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

// connect to whatever is in the environment variable port or 3000 if there is nothing else.


