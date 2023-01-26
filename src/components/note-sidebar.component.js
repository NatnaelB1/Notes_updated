import Box from '@mui/material/Box';
import "../App.css"
import React from'react';
import { useContext, useEffect, useState } from 'react';
import NoteCard from "./note.component";
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import { Button, Grid, TextField } from '@mui/material'
import { determineRelatednessOfSentences } from '../api/universalSentenceEncoder';

function NoteSideBarArea(){
    const {auth} = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [relatedNotes, setRelatedNotes] = useState([]);

    useEffect(() => {
        similarNotes();
    }, [store.activeNote]);

    const similarNotes = () => {
        const index = store.userNotes.findIndex(note => 
          note._id === store.activeNote._id
        ); 
        
        const note_body = store.userNotes.map(note => {
          return note.notebody;
        })
        
        determineRelatednessOfSentences(note_body,index)
        .then(
          result => {
            const related_notes = result.map(n => {
                if(n.score > 0.5){
                   return store.userNotes[n.indexOne]._id;
                }
            })
            
          setRelatedNotes(related_notes);
          }  
        )
        .catch ((e)=>
                console.log(e)
        );
     }

    return(
        <Box
            style={{padding: "0px"}}
            sx={{
                 height:"86vh",  
                 width:"30vw",
                 padding: 0,
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
            {store.userNotes && 
                store.userNotes.
                filter((note) => note.notebody.toLowerCase().includes(store.searchQuery.toLowerCase())).
                map((note) => <NoteCard key={note._id} relatedNotes = {relatedNotes} _id = {note._id} note_tags = {note.note_tags} notebody={note.notebody} lastModified={note.lastModified}/>)
            }
            
        </Box>
    )
}

export default NoteSideBarArea;