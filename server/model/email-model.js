const mongoose = require('mongoose')
const Schema = mongoose.Schema

const emailSchema = new Schema({
    email: String,
    passcode: Number,
},{
    expires: 600
})

module.exports = mongoose.model('Email', emailSchema)