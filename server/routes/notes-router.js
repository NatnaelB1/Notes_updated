const auth = require('../auth')
const express = require('express')
const NoteController = require('../controllers/note-controller')
const UserController = require('../controllers/user-controller')
// const EmailController = require('../controllers/email-controller')

const router = express.Router()

//User routes
router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)
router.put('/user', UserController.updateUser)
router.delete('/user', UserController.deleteUser)
router.put('/changePassword', UserController.changePassword)
router.post('/emailVerified', UserController.emailVerified)
router.put('/passwordReset', UserController.passwordReset)

//Note routes
router.put('/updateNote', NoteController.updateNote)  //done
router.delete('/deleteNote', NoteController.deleteNote)//done
router.get('/getAllSharedNotesByUser', NoteController.getAllSharedNotesByUser)//done
router.get('/getAllNoteByUser', NoteController.getAllNoteByUser) //done
router.post('/createNote', NoteController.createNote) //done
router.get('/getNote', NoteController.getNote) //done

//Password Recovery
// router.post('/sendEmail', EmailController.sendEmail)
// router.get('/passcodeVerify', EmailController.passcodeVerify)

module.exports = router