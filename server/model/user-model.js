const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema(
    {
        my_notes: [{type: Schema.Types.ObjectId, ref: 'Notes'}],     // type: array - list of notes created by the user 
        shared_notes: [{type: Schema.Types.ObjectId, ref: 'Notes'}], // type: array - list of notes shared with the user
        passwordHash: { type: String, required: true, minlength: 8}, // password of the user
        profile_picture: {  type: String  },                         // image will be stored in cloudinary, and link to the image will be stored in the database
        email: { type: String, required: true, maxlength: 100, unique: true},   // Email account of the user
        username: { type: String, required: true, maxlength: 100, unique: true} // user name of the user               
    }
)

module.exports = mongoose.model('User', userSchema)
