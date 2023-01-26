import {BrowserRouter, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import React from'react';
import { AuthContextProvider } from "./auth";
import { GlobalStoreContextProvider } from './store';
import { createTheme, ThemeProvider } from "@mui/system";
import Navigation from "./routes/Navigation";
import Home from "./routes/Home";
import SignUp from "./routes/SignUp"
import SignIn from "./routes/SignIn"
import AccountSettings from "./routes/AccountSettings";
import SideBar from "./routes/SideBar";
import MainArea from "./routes/MainArea";
import { loadModel } from './api/universalSentenceEncoder';

loadModel();

function App() {
  return (  
    <BrowserRouter>
    <AuthContextProvider>
      <GlobalStoreContextProvider>  
          <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/SignIn" element={<SignIn/>}/>
            <Route path="/SignUp" element={<SignUp/>}/>
            <Route path="/AccountSettings" element={<AccountSettings/>}/>
            {/* <Route path="/SideBar" element={<SideBar/>}/>
            <Route path="/MainArea" element={<MainArea/>} /> */}
          </Routes>
      </GlobalStoreContextProvider>
    </AuthContextProvider>
    </BrowserRouter>

  );
}

export default App;
