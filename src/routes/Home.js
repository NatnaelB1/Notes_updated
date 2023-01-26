import Box from '@mui/material/Box';
import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import "../App.css"
import { useEffect } from 'react'
import React from'react';
import AuthContext from '../auth';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import SideBar from './SideBar';
import MainArea from './MainArea';

function Home() {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    useEffect(() => {
        const getData = async () => { 
            if (auth.user){
                store.getUserNotes(auth.user._id)
            }
        }
        getData();
      }, [auth.user])

    return (
        <Box 
            className="home-container" 
            style={{padding: "0px"}}
            sx={{ 
                height:"100vh",  
                width:"100vw", 
                p: 1,
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                color: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                border: '1px solid',
                borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                fontSize: '0.875rem',
                fontWeight: '700'
            }}
        >
            <SideBar />
            <MainArea/>
        </Box>

    );

}

export default Home;