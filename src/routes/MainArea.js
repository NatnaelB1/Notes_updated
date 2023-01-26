
import Box from '@mui/material/Box';
import "../App.css"
import React from'react';
import MainNavbar from '../components/main-navbar.component';
import NoteArea from '../components/note-area.component';
import TagArea from '../components/tag-area.component';

function MainArea(){

    return(
        <Box
            style={{padding: "0px", height:"100vh",  width:"70vw", }}
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
            <MainNavbar/>
            <NoteArea/>
            <TagArea/>
        
        </Box>
    )
}

export default MainArea;