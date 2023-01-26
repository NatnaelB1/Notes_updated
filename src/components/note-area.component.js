import Box from '@mui/material/Box';
import "../App.css"
import React from'react';
import { useContext, useEffect, useState } from 'react';
import Textarea from '@mui/joy/Textarea';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';


function NoteArea(){
    const {auth} = useContext(AuthContext);
    const {store} = useContext(GlobalStoreContext)

    const [newNote, setNewNote] = useState(" ")

    const handleNoteUpdate = (value) => {
        setNewNote(value)
        store.activeNote.notebody = value
        // store.updateNote(store.activeNote)
    }
    function debounce(func, timeout = 1000){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
    function saveInput(){
        console.log("note updated")
        store.updateNote(store.activeNote, auth.user.username)
    }
    const processChanges = debounce(() => saveInput());

    return(
        <Box
            style={{height:"80vh", width:"70vw", padding: 0}}
            sx={{
                 
                 padding: "0px 0px",
                 p: 1,
                 bgcolor: (theme) =>
                     theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                 color: (theme) =>
                     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                 border: '1px solid',
                 borderColor: (theme) =>
                     theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                 fontSize: '0.875rem',
                 fontWeight: '700',
                  
                }}
        >
            <Textarea
                color="neutral"
                variant="Solid"
                disabled={store.activeNote._id == null ? true : false}
                sx = {{height: "80vh"}}
                size="lg"
                placeholder="write something ..."
                value={store.activeNote ? store.activeNote.notebody : ""}
                onChange={(event) => handleNoteUpdate(event.target.value)}
                onKeyUp={processChanges}
            />
           
        </Box>
    )
}

export default NoteArea;