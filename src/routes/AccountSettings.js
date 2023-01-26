import React, { createContext, useEffect, useState } from "react";
import { Button, Grid } from '@mui/material';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import "../App.css"
import AuthContext from '../auth';
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import LoginModal from "../components/login-modal.component";
import { uploadImageToCloudinaryAPIMethod } from "../api/cloudinary"
import { Box } from "@mui/system";
import { useNavigate } from 'react-router-dom';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

function AccountSettings() {
    
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

    const [username, setUsername] = useState(auth.loggedIn ? auth.user.username: "")       // For username input filed
    const [email, setEmail] = useState(auth.loggedIn ? auth.user.email: "")                // For email input field
    const [currentPassword, setCurrentPassword] = useState("")                             // For current password input field 
    const [password, setPassword] = useState("")                                           // For password input field
    const [passwordVerify, setPasswordVerify] = useState("")                               // For password verify input field 
    const [checked, setChecked] = useState(false);                                         // For checking if user agreed to conditions before deleting account      

    const [modalActive, setModalActive] = React.useState(false);                 // Modal for when the user trys to update account info without an inputs
    const [passwordModal, setPasswordModal] = React.useState(false);             // Modal for checking if password & Verify password match
    const [passwordFormatModal, setPasswordFormatModal] = React.useState(false); // For checking if password format is correct
    const [emailModal, setEmailModal] = React.useState(false);                   // For checking if email format is correct     
    const [errorModal, setErrorModal] = useState(auth.error != null);            // Modal for when there is an error updating a field  

    useEffect(() => {
        if (auth.user){
        //   setErrorModal(auth.error != null);
          setUsername(auth.user.username)
          setEmail(auth.user.email)
        }
        else{
            navigate("/AccountSettings", {})
        }
    }, [auth])

    const handleModalClose = () => {   // For closing modal
        setModalActive(false)
    }
    const handlePasswordModalClose = () => {  // For closing modal
        setPasswordModal(false)
    }
    const handleEmailModalClose = () => {  // For closing modal
        setEmailModal(false)
      }
    const handlePasswordFormatModalClose = () => { // For closing modal
        setPasswordFormatModal(false)
    }
    const handleErrorModalClose = () => {
        setErrorModal(false)
        auth.resetError()
    }


    const password_Format_modal = passwordFormatModal ? <LoginModal message = "Password should have at least 1 lower, 1 upper case and 1 number. Password should also be longer than 8 characters!" onClose={handlePasswordFormatModalClose}></LoginModal>: null;
    const email_modal = emailModal ? <LoginModal message = "Email is invalid!" onClose={handleEmailModalClose}></LoginModal>: null;
    const modal = modalActive ? <LoginModal message= "Enter the required field first!" onClose={handleModalClose}> </LoginModal>: null;
    const delete_modal = passwordModal ? <LoginModal message = "Passwords do not match!" onClose={handlePasswordModalClose}></LoginModal>: null;
    const error_modal = errorModal ? <LoginModal message={auth.error} onClose={handleErrorModalClose}></LoginModal> : null


    const updateField = (event, type) => {
        switch(type){
          case "username":
            setUsername(event.target.value)
            break;
          
          case "currentPassword":
            setCurrentPassword(event.target.value)
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
    
    const handleHomescreenNavigation = () => {
        navigate('/home', {})
    }
    const handleLogout = () => {
        auth.logoutUser();
        navigate('/SignIn', {})
    }
    const handleImageSelected = (event) => {
        console.log("New File Selected");
        if (event.target.files && event.target.files[0]) {
      
            const selectedFile = event.target.files[0];
            console.dir(selectedFile);
      
            const formData = new FormData();
    
            const unsignedUploadPreset = 'mftlkxf6'
            formData.append('file', selectedFile);
            formData.append('upload_preset', unsignedUploadPreset);
      
            console.log("Cloudinary upload");
            uploadImageToCloudinaryAPIMethod(formData)
            .then(async(response) => {
                console.log("Upload success");
                console.dir(response);
                console.log(response.url)
   
                auth.user.profile_picture = response.url
                auth.setNewUserInfo(auth.user)
            });
        }

    }
    const handleDeleteAccount = () => {         // handles request for Deleting account  
        if (checked === false){
            setModalActive(true)
            return;
        }

        auth.deleteUser(auth.user._id)

    }
    const handleCheckBox = (event) => {             // Checks if checkbox is checked before deleting account 
        setChecked(event.target.checked);
    };
    
    const handleChangeUsername = () => {  // handles request for changing user name 
        if (username === ""){
            setModalActive(true)
            return;
        }
        auth.user.username = username;
        auth.setNewUserInfo(auth.user)
    }
    const handleEmailChange = () => {
        let mail_format = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (email === ""){
            setModalActive(true)
            return;
        }
        if (!mail_format.test(email)) {
          setEmailModal(true)
          return;
        }
        auth.user.email = email;
        auth.setNewUserInfo(auth.user)
    }
    const handlePasswordChange = () => {        // handles request for changing Password
        let password_format = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}/;
        if (currentPassword === "" && password === "" && passwordVerify === "" ){
            setModalActive(true)
            return;
        }
        if (!password_format.test(password)) {
            setPasswordFormatModal(true)
            return;
        }
        if (password !== passwordVerify){
            setPasswordModal(true)
            return;
        }
        let userData = {
            id: auth.user._id,
            currentPassword: currentPassword,
            password: password,
            passwordVerify: passwordVerify,
          }
          auth.setNewPassword(userData)

    }

    return(
       <Box
       style={{padding: "0px", display:"flex", flexDirection: "row"}}
            alignItems="center"
            sx={{ 
                height:"100vh",  
                width:"100vw",
                backgroundColor: "rgb(247, 255, 255)",
            }}
       >
            {modal}
            {delete_modal}
            {password_Format_modal}
            {email_modal}
            {error_modal}
            
            <Box
                component="form"
                style={{padding: "5px", display:"flex", flexDirection: "column"}}
                alignItems="center"
                sx={{
                    
                    width: "30vw",
                    height: "90%",
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold', 
                    fontSize: 16,
                    margin: 5,
                    backgroundColor: "rgb(247, 255, 255)"

                }}
                noValidate
                autoComplete="off"
                
            >
                       
                    <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" onChange={handleImageSelected}/>
                        <Avatar
                                alt="Profile Image"
                                src= {auth.loggedIn ? auth.user.profile_picture : "/static/images/avatar/1.jpg"}
                                sx={{ width: '25vh', height: '25vh' }}
                                
                        />
                    </IconButton>
             
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
                     {auth.loggedIn && auth.user.email}
                    </Box>
                    
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
                    {auth.loggedIn && auth.user.username}
                    </Box>
                    <Box
                        component="form"
                        style={{padding: "5px", display:"flex", flexDirection: "row", justifyContent: "space-between"}}
                        sx={{
                            
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold', 
                            fontSize: 16
                        }}
                        noValidate
                        autoComplete="off"
                        
                    >
                        <Box
                            component="form"
                            style={{padding: "5px", display:"flex", flexDirection: "column"}}
                            sx={{
                                
                                fontFamily: 'sans-serif',
                                fontWeight: 'bold', 
                                fontSize: 16
                            }}
                            noValidate
                            autoComplete="off"
                         >
                            <Typography>Total Notes - {auth.loggedIn && auth.user.my_notes.length}</Typography>                

                        </Box>
                        {/* <Box
                             component="form"
                             style={{padding: "5px", display:"flex", flexDirection: "column"}}
                             sx={{
                                 '& > :not(style)': { m: 1, width: '25ch' },
                                 fontFamily: 'sans-serif',
                                 fontWeight: 'bold', 
                                 fontSize: 16
                             }}
                             noValidate
                             autoComplete="off"
                        >
                            <Typography>Shared Notes</Typography>
                            <Typography>{auth.loggedIn && auth.user.shared_notes.length}</Typography>
                            
                        </Box> */}
                    </Box>
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
                        <Button variant="outlined" color="error" component="label" size="small" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </Box>


            </Box>

            <Box
                component="form"
                style={{padding: "10px"}}
                sx={{
                    overflowY: "auto",
                    width: "60vw",
                    height: "90%",
                    fontFamily: 'sans-serif',
                    margin: "5px 5px 5px 0px",
                    backgroundColor: "rgb(247, 255, 255)",
                    borderRadius: 2,
                    borderStyle: "groove",
                    borderWidth: "1px",
                    borderColor: "#faf2f2"
                }}
            >
                <Box
                    style={{padding: "0px", width: "58vw", display:"flex", flexDirection: "row", justifyContent: "space-between" }}
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold', 
                        fontSize: 24
                    }}
                    noValidate
                    autoComplete="off"
                    
                >
                    Account Settings
                   <CancelPresentationIcon 
                        style={{width: "25px", cursor: 'pointer'}} 
                        sx={{color: "red"}} 
                        onClick={handleHomescreenNavigation}/>
                </Box>
                <Divider 
                    variant="middle" 
                    style={{width: "58vw", marginLeft: 0, marginRight: 0}} 
                    sx={{borderBottomWidth: 4, "margin": "2%"}}/>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        fontSize: 16
                    }}
                    noValidate
                    autoComplete="off"
                >
                   Change Username
                   <Divider variant="middle" style={{width: "58vw", marginLeft: 0}} sx={{borderBottomWidth: 1, "marginBBottom": "2%"}}/>
                   <TextField 
                        style={{marginLeft: 0}} 
                        id="outlined-basic" 
                        label="Username" 
                        variant="outlined" 
                        onChange= {(event) => updateField(event, "username")} 
                        value={username}
                   />
                   <Button 
                        variant="contained" 
                        component="label"
                        size="small"
                        onClick = {handleChangeUsername}
                        
                    >
                        Save Changes
                    </Button>

                </Box>
                
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        fontSize: 16
                    }}
                    noValidate
                    autoComplete="off"
                >
                   Change Email Address
                   <Divider variant="middle" style={{width: "58vw", marginLeft: 0}} sx={{borderBottomWidth: 1, "marginBBottom": "2%"}}/>
                   <TextField 
                        style={{marginLeft: 0}} 
                        id="outlined-basic" 
                        label="email" 
                        variant="outlined" 
                        value={email}
                        onChange={(event) => updateField(event, "email")}
                    />
                   <Button 
                        variant="contained" 
                        component="label" 
                        size="small"
                        onClick = {handleEmailChange}
                    >
                        Save Changes
                   </Button>

                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        fontSize: 16
                    }}
                    noValidate
                    autoComplete="off"
                >
                   Change Password
                   <Divider variant="middle" style={{width: "58vw", marginLeft: 0}} sx={{borderBottomWidth: 1, "marginBBottom": "2%"}}/>
                   <TextField 
                        style={{marginLeft: 0}} 
                        id="outlined-basic" 
                        label="Current Password" 
                        variant="outlined" 
                        onChange={(event) => updateField(event, "currentPassword")}
                    />

                   <Box
                        
                        component="form"
                        style={{padding: "0px", display:"flex", flexDirection: "row", marginLeft: 0}}
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                            fontSize: 16
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Box sx={{ display: 'inline' }} style={{marginLeft: 0}} >
                            <TextField  
                                style={{marginLeft: 0, width: '20.5vw'}} 
                                id="outlined-basic" 
                                label="New Password" 
                                variant="outlined" 
                                onChange={(event) => updateField(event, "password")}
                            />  
                        </Box>
                        <Box sx={{ display: 'inline' }}>
                            <TextField 
                                style={{marginLeft: 0, width: '20.5vw'}} 
                                id="outlined-basic"
                                label="Confirm Password" 
                                variant="outlined" 
                                onChange={(event) => updateField(event, "passwordVerify")}
                            />
                        </Box>

                    </Box>
                    <Button 
                        variant="contained"
                        style={{marginLeft: 0}} 
                        component="label" 
                        size="small" 
                        onClick={handlePasswordChange}>
                        Save Changes
                    </Button> 

                </Box>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                        fontSize: 16
                    }}
                    noValidate
                    autoComplete="off"
                >
                   Delete Account
                   <Divider variant="middle" style={{width: "58vw"}} sx={{borderBottomWidth: 1, "marginBBottom": "2%"}}/>
                    If you delete your account please keep the following in mind:
                       Your profile will be permanently deleted, including all the Notes you created and shared
                  
                <Box style={{width: "60vw"}}>
                <Checkbox {...label} onChange={handleCheckBox} checked={checked}/>
                <Box component="div" sx={{ display: 'inline' }}>I have read and understood the consequences of deleting my account</Box>
                
                </Box>
                    <Button 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        style={{marginLeft: 0}} 
                        startIcon={<DeleteIcon />}
                        onClick = {handleDeleteAccount}
                    >
                        Delete Account
                    </Button>

                </Box>

            </Box>

       </Box>
    );
}

export default AccountSettings;