import "../App.css"
import React from'react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { Button, Grid, TextField } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function SearchBox () {

  const {auth} = useContext(AuthContext);
  const {store} = useContext(GlobalStoreContext)

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchText = (e) => {
    setSearchQuery(e)
  }
  const handleSearchQuery = () => {
    store.searchResult(searchQuery)
  }
    
  return(
      <Box
          style={{paddingLeft: 0, display:"flex", justifyContent:"space-around"}}
          sx={{
                height:"4vh", 
                width:"30vw",
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
          <SearchIcon style={{margin: '2px', "justifyContent": "center"}}/>
          <input 
            style={{ height: "4vh", width:"20vw", padding: 0, alignItems: "center"}}
            onChange={(event) => handleSearchText(event.target.value)}
          />
          <Button 
            variant="contained" 
            onClick={handleSearchQuery} 
            style={{height: "4vh"}}
            >
                GO
          </Button>
      </Box>
  )
}

export default SearchBox;