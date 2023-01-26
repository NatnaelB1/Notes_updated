import { TextField, Button, Box, Typography, FormControl} from '@mui/material';
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../App.css"
import { useEffect } from 'react'
import React from'react';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import logo from '../assets/logo-no-background.png'
import { makeStyles } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from '@mui/material/Link';
import LoginModal from "../components/login-modal.component";

function SignIn() {

    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const {store} = useContext(GlobalStoreContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleCloseModal = () => {
        auth.retryLogin();
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleSignUp = () => {
        
        navigate("/signup", {})
    }
    const handlelogin = async () => {
        let userData = {
            email: email,
            password:password,
        }
        
        await auth.setLoggedIn(userData)
        await store.getUserNotes(auth.user._id)

    }

    //only show modal if login fails
    let loginModal = !auth.successfulLogin ? <LoginModal message={auth.error} onClose={handleCloseModal}></LoginModal> : null
  
    return (
        <Box 
            style={{padding: "0px", display:"flex", flexDirection: "column"}}
            alignItems="center"
            sx={{ 
                height:"100vh",  
                width:"100vw"
            }}
        >
            {loginModal}
            <Box 
                component="img"
                sx={{ height: "20vh", width: "40vw", marginTop: "15vh",marginBottom: "5vh" }}
                alt="Logo"
                src={logo}
            />

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold', 
                    fontSize: 16
                }}
                noValidate
                autoComplete="off"
                
            >
               Welcome back! 👋
            </Box>

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
             
                <TextField id="outlined-basic" label="Email" variant="outlined" onChange={handleEmailChange} value={email} />

            </Box>
            
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
             
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                        onChange={handlePasswordChange} 
                        value={password}
                    />
                </FormControl>
                
            </Box>
            
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Button style={{backgroundColor : "#0084ff"}} variant="contained" color="success" onClick={handlelogin}>
                    Sign in
                </Button>
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Typography >
                    Don't have an account yet? 
                    <Link href="#" underline="hover" onClick={handleSignUp}>{' Sign up '}</Link>
                 </Typography> 
            </Box>

          
        </Box>

    );

}

export default SignIn;