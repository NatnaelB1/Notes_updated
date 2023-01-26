import Box from '@mui/material/Box';
import "../App.css"
import React from'react';

import SideNavbar from '../components/sidebar-navbar.component';
import SearchBox from '../components/search-area.component';
import NoteArea from '../components/note-area.component';
import NoteSideBarArea from '../components/note-sidebar.component';

function SideBar(){

    return(
        <Box
            className='SideBar'
            style={{padding: "0px", height:"100vh", width: "30vw"}}
            sx={{
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
                 display: { xs: 'none', sm: 'block', md: 'block', width: '100vw' }
                  
                }}
        >
            <SideNavbar/>
            <SearchBox/>
            <NoteSideBarArea/>
            
        </Box>
    )
}

export default SideBar;