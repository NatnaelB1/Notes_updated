
const Note = require('../model/note-model')
const User = require('../model/user-model')
const bcrypt = require('bcryptjs')


createNote = async (req, res) => {
    try {
        const { _id, notebody, lastModified, creator} = req.body;

        if (!notebody || !lastModified || !creator) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        const existingNote = await Note.findOne({ _id: _id });
        if (existingNote != null) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "A Note with the same ID already exists."
                })
        }
        const newNote = new Note({  
            notebody: req.body.notebody,
            lastModified: req.body.lastModified,
            note_tags: [ ], 
            creator: req.body.creator
        })
        const loggedInUser = await User.findOne({username: creator});
        loggedInUser.my_notes.push(newNote._id)

        if(_id) {
            newNote._id = _id
        }

        await Note.create(newNote);
        await loggedInUser.save()


        return res.status(200).json({
            success: true,
            Note: newNote,
            user: loggedInUser,
            message: "Note successfully created"
        })
    }
    catch (err) {
        console.error(err); 
        res.status(500).send();
    }

 
}

getNote = async (req, res) => {
    try {
        if(!req.body._id){
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("Note get:" +req.body._id )
        Note.findOne({_id: req.body._id}, function (err, docs) {
            if (err){
                console.log(err)
                return res.status(404).json({
                    message: "Note not found!"
                })
            }
            else{
                return res.status(200).json({
                    success:true,
                    note: docs 
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

getAllNoteByUser = async (req, res) => {
    try {
        const {_id} = req.query._id;
   
        if(!req.query){
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        } 

        const user = await User.findOne({_id: req.query._id})
    
        await processArray(user.my_notes).then((results) => {
            // console.log(results); 
            return res
            .status(200) 
            .json({ 
                Message: "success!",
                notes: results 
            });
        });
    }
    catch (err){
        console.error(err);
        res.status(500).send();
    } 
}

getAllSharedNotesByUser = async (req, res) => {
    try {
        const { _id} = req.query._id;

        if(!req.query){
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        } 

        const user = User.findOne({_id: req.query._id})
        
        await processArray(user.shared_notes).then((results) => {
            console.log(results); 
            return res
            .status(200) 
            .json({ 
                Message: "success!",
                notes: results 
            });
        });

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }

}

deleteNote = async (req, res) => {

    try{
        const _id  = req.body.deleteObject._id;
        const loggedInUser_id = req.body.deleteObject.loggedInUser_id

        if(!_id || !loggedInUser_id){
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        const loggedInUser = await User.findOne({_id :loggedInUser_id})            
        loggedInUser.my_notes = loggedInUser.my_notes.filter(note => note != _id)
        await loggedInUser.save();
          
        Note.findOneAndDelete({_id: _id}, function (err, docs) {
            if (err){
                console.log(err);
                return err;
                
            }
            else{
                return res
                .status(200)
                .json({ Message: "success!", Note:docs });
                 
            }
        })
    } catch (err){
        console.error(err);
        res.status(500).send();
    }

}

updateNote = async (req, res) => {
    try{
        const { _id, notebody, lastModified, creator, note_tags } = req.body;
        const selectedNote = await Note.findOne({ _id: _id });

        if(!selectedNote) {
            return res
                .status(404)
                .json({ errorMessage: "The Note with _id:" + _id + " does not exist" });
        }

        selectedNote.notebody = notebody;
        selectedNote.lastModified = lastModified;
        selectedNote.creator = creator;
        selectedNote.note_tags = note_tags;

        Note.findOneAndUpdate({_id: _id}, {
            notebody : notebody,
            lastModified : lastModified,
            creator : creator,
            note_tags : note_tags
        }, function (err, docs) {
            if (err){
                console.log(err)
                return res.status(500).send();
            }
            else{
                return res
                    .status(200)
                    .json({ 
                        Message: "Note Updated.",
                        Note: docs 
                    
                    });
            }
        });   
    } catch (err){
        console.error(err);
        res.status(500).send();
    }
}

async function processArray(arr) {
    // Use the map method to call an async function on each element
    // and store the resulting array of promises
    const results = arr.map(async (note) => {
      // Perform some async operation on the element
      const result = await Note.findById(note);
      return result;
    });
    // Wait for all of the async operations to complete and return the results
    return await Promise.all(results);
}

module.exports = {
    updateNote,
    deleteNote,
    getAllSharedNotesByUser,
    getAllNoteByUser,
    getNote,
    createNote
} 
