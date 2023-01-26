const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const noteSchema = new Schema(
    {
        notebody: { type: String, required: true, maxlength: 100},
        lastModified: {type: String},
        creator: {type: String},
        note_tags: {type: [{}]},

    }
)

module.exports = mongoose.model('Note', noteSchema)