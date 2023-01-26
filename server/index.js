// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

console.log("\n\nNEW SERVER\n")

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const notesRouter = require(__dirname +'/routes/notes-router.js')
app.use('/api', notesRouter)

// INITIALIZE OUR DATABASE OBJECT
const db = require(__dirname +'/db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


    const path = require('path');
    // Exprees will serve up production assets
    app.use(express.static(path.join(__dirname, "client", "build")));
    app.use(express.static('client'));

    console.log(path.join(__dirname, 'client', 'build') + "\n")
    console.log((path.resolve(__dirname, "client", "build")) + "\n")
  
    // Express serve up index.html file if it doesn't recognize route
    app.get('/*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  

// PUT THE SERVER IN LISTENING MODE
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
