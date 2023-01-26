import Box from '@mui/material/Box';
import "../App.css"
import {useLocation} from 'react-router-dom';
import { useContext } from 'react';
import GlobalStoreContext from '../store';

const Navigation=() =>{ 
    const {store} = useContext(GlobalStoreContext)
      const location = useLocation();
      const pathname = location.pathname;
  
      return (
        <Box>
       
        </Box>
      );
    }
    
    export default Navigation;