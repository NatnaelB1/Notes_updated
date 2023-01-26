import Box from '@mui/material/Box';
import "../App.css"
import React from'react';
import { useContext, useEffect, useState } from 'react';
import { Hidden, withStyles } from '@mui/material';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import saveAs from 'save-as'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Navigate, useHistory, useNavigate } from 'react-router-dom'

function MainNavbar(){
    const {auth} = useContext(AuthContext);
    const {store} = useContext(GlobalStoreContext)
    const navigate= useNavigate();

    const handleSaveNote = () => {
        if (store.activeNote._id === undefined ){
            return;
        }
        store.updateNote(store.activeNote, auth.user.username)
    }
    const handleShareNote = () => {
    
    }
    const handleViewNotes = () => {
        navigate('/SideBar',{})
    }

    const handleNoteDownload = () => {
        if (store.activeNote._id === undefined ){
            return;
        }
        let blob = new Blob([store.activeNote.notebody], { type: 'text/plain;charset=utf-8' })
        let name = store.activeNote.notebody.length > 10 ? store.activeNote.notebody.substring(0, 9) : "New Note.txt"
        saveAs(blob, name)   
    }
    const handleDeleteNote = () => {
        if (store.activeNote._id === undefined ){
            return;
        }
        store.deleteNote(store.activeNote._id, auth.user._id)
    }

    return(
        <Box
            className='mainNavbar'
            style={{height:"5vh",  width:"70vw", paddingLeft: 0, paddingRight: 0}}
            sx={{
                 
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
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                
                <ArrowBackIcon
                    className='ArrowBackIcon'
                    onClick = {handleViewNotes}
                    
                    sx={{
                        display: { xs: 'block', sm: 'none', md: 'none' }, 
                        width: '5vh', 
                        height: '5vh',
                        '&:hover': {
                            opacity: [0.2, 0.3, 0.7],
                        },
                        
                    }}
                    
                />

                <SaveIcon
                    onClick = {handleSaveNote}
                    sx={{
                        width: '5vh', 
                        height: '5vh',
                        '&:hover': {
                            opacity: [0.2, 0.3, 0.7],
                        },
                    }}
                />
                <DownloadIcon
                    onClick = {handleNoteDownload}
                    sx={{
                        width: '5vh', 
                        height: '5vh',
                        '&:hover': {
                            opacity: [0.2, 0.3, 0.7],
                        },
                    }}
                />
                <PersonAddAltIcon
                    onClick = {handleShareNote}
                    sx={{
                        width: '5vh', 
                        height: '5vh',
                        '&:hover': {
                            opacity: [0.2, 0.3, 0.7],
                        },
                    }}
                />
                <DeleteOutlineIcon
                    onClick = {handleDeleteNote}
                    sx={{
                        width: '5vh', 
                        height: '5vh',
                        '&:hover': {
                            opacity: [0.2, 0.3, 0.7],
                        },
                    }}
                />

            </Box>
        </Box>
    )
}

export default MainNavbar;