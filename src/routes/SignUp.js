import { TextField, Button, Box, Typography, FormControl} from '@mui/material';
import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { useNavigate } from 'react-router-dom';
import "../App.css"
import { useEffect } from 'react'
import React from'react';
import AuthContext from '../auth';
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

function SignUp() {
    //const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [passwordVerify, setPasswordVerify] = useState("")
    const [passwordModal, setPasswordModal] = React.useState(false);
    const [emailModal, setEmailModal] = React.useState(false);
    const [emptyInputModal, setEmptyInputModal] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    const handleEmailModalClose = () => {
        setEmailModal(false)
    }
    const handlePasswordModalClose = () => {
        setPasswordModal(false)
    }
    const handleCloseModal = () => {
        auth.retryLogin();
    }

    const password_modal = passwordModal ? <LoginModal message = "Password should have at least 1 lower, 1 upper case and 1 number. Password should also be longer than 8 characters!" onClose={handlePasswordModalClose}></LoginModal>: null;
    const email_modal = emailModal ? <LoginModal message = "Email is invalid!" onClose={handleEmailModalClose}></LoginModal>: null;
    
    const Empty_input =  
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
                color: "red"
            }}
            noValidate
            autoComplete="off"
        >
            Make sure all required inputs are filled out!  
        </Box>

    const handleSignin = () => {
        navigate("/signin", {})
    }

 
    const updateField = (event, type) => {
        // setEmailModal(false)
        // setPasswordModal(false)
        setEmptyInputModal(false)
        switch(type){
          case "username":
            setUsername(event.target.value)
            break;
  
          case "password":
            setPassword(event.target.value)
            break;
  
          case "passwordVerify":
            setPasswordVerify(event.target.value)
            break;
  
          case "email":
            setEmail(event.target.value)
            break;
        }
  
    }
    const handleCreateAccount = () => {
        if (username === "" || password === "" ||  passwordVerify === "" || email === ""){
            setEmptyInputModal(true)
            return;
        }
        let mail_format = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        let password_format = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}/;
        if (!mail_format.test(email)) {
          setEmailModal(true)
          return;
        }
        if (!password_format.test(password)) {
          setPasswordModal(true)
          return;
        }
        let userData ={
          username: username,
          password: password,
          passwordVerify: passwordVerify,
          email: email,
          profile_picture: "https://res.cloudinary.com/natialemu47/image/upload/v1652196653/dnt17uj4nl9ywfq648v8.jpg"
        }
        auth.registerUser(userData)
    }
    let loginModal = !auth.successfulRegister ? <LoginModal message={auth.error} onClose={handleCloseModal}></LoginModal> : null
  
    return (
        <Box 
            style={{padding: "0px", display:"flex", flexDirection: "column"}}
            alignItems="center"
            sx={{ 
                height:"100vh",  
                width:"100vw"
            }}
        >
            {password_modal}
            {email_modal}
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
                }}
                noValidate
                autoComplete="off"
            >
             
                <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(event) => updateField(event, "username")}/>

            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
             
                <TextField id="outlined-basic" label="email" variant="outlined" onChange={(event) => updateField(event, "email")}/>
                
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
                        onChange={(event) => updateField(event, "password")}
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
             
             <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
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
                        label="Confirm Password"
                        onChange={(event) => updateField(event, "passwordVerify")}
                    />
                </FormControl>
            </Box>
            
            {/* {passwordModal && Incorrect_password}
            {emailModal && Incorrect_email}*/}
            {emptyInputModal && Empty_input} 

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Button style={{backgroundColor : "#0084ff"}} variant="contained" color="success" onClick={handleCreateAccount}>
                    Create Account
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
                    Already have an account? 
                    <Link href="#" underline="hover" onClick={handleSignin}>{' Sign in'}</Link>
                 </Typography> 
            </Box>

          
        </Box>

    );

}

export default SignUp;