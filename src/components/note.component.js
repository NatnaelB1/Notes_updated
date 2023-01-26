import Box from '@mui/material/Box';
import "../App.css"
import React from'react';
import { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';

function NoteCard({_id ,notebody, lastModified, note_tags, relatedNotes}){
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    
    const handleActiveNote = (_id, notebody, lastModified, note_tags) => {
        const note = {
            _id: _id,
            notebody: notebody,
            lastModified: lastModified,
            note_tags: note_tags
        }
        store.setActiveNote(note)
    }

    let highlightedColor = store.activeNote._id === _id ?  "#82b8f1" : "" 
    let relatedColor = relatedNotes.includes(_id) && store.activeNote._id !== _id  ?  "#5e2be0" : "" 
    return(
        <Box
            _id={_id}
            onClick = {() => handleActiveNote(_id, notebody, lastModified, note_tags)}
            style={{paddingTop: "5px", marginBottom: "2px", cursor: 'pointer'}}
            sx={{
                 height:"5vh", 
                 width:"95%",
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
                 '&:hover': {
                    borderColor: 'primary.main',
                    opacity: [0.2, 0.3, 0.7],
                  },
                  backgroundColor:highlightedColor,
                  color: relatedColor
                  
                }}
                
        >
            <Typography 
                variant="h6" 
                gutterBottom 
                sx={{marginBottom: "0px" }}
                style={{"overflow": "hidden", "whiteSpace": "nowrap", "textOverflow": "ellipsis"}}
            >
                {notebody}
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                <Typography variant="caption"  gutterBottom>
                    {lastModified}
                </Typography>
                {relatedColor && <Typography variant="caption" gutterBottom style={{marginRight: "15px"}}>
                    similar
                </Typography>}
            </Box>
        </Box>
    )
}

export default NoteCard;