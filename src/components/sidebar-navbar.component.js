import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react';
import "../App.css"
import React from'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import { IconButton } from '@mui/material';

function SideNavbar(){
    const {auth} = useContext(AuthContext);
    const {store} = useContext(GlobalStoreContext)
    const navigate = useNavigate();

    const handleAccountSettingNavigation = () => {
        navigate("/AccountSettings", {})
    }
    const handleAddNote = async () => {
        const newNote = {
            notebody: " ",
            lastModified: "",
            creator: auth.user.username
        };
        await store.createNote(newNote)
        await store.getUserNotes(auth.user._id)
        // await store.getSharedNotes(auth.user._id)
        console.log(store.activeNote)

    }
    
    return(
        <Box
            sx={{
                 height:"5vh", 
                 width:"29vw",
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
                <IconButton style={{padding: 0}} onClick = {handleAccountSettingNavigation}>
                    <Avatar
                        
                        alt="Profile Image"
                        src= {auth.loggedIn ? auth.user.profile_picture : "/static/images/avatar/1.jpg"}
                        sx={{ width: '5vh', height: '5vh' }}
                    />
                </IconButton>
                <Typography gutterBottom sx={{fontSize: '3vh' }}>
                    My Notes
                </Typography>
               
                <NoteAddIcon
                    sx={{
                        width: '5vh', 
                        height: '5vh', 
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: [0.2, 0.3, 0.7],
                        },
                    
                    }}
                    onClick={handleAddNote}
                />
                

            </Box>
        </Box>
    )
}

export default SideNavbar;