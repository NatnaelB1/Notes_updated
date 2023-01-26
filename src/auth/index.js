import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    SET_LOGGED_IN: "SET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGOUT: "LOGOUT",
    REGISTER_RETRY: "REGISTER_RETRY",
    LOGIN_RETRY: "LOGIN_RETRY",
    RESET_ERROR: "RESET_ERROR",
    EMAIL_VERIFICATION : "EMAIL_VERIFICATION"
}

function AuthContextProvider(props) {

    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        successfulRegister: true,
        successfulLogin: true,
        error: null,
        emailCheck: false
    });

    const history = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const {type, payload} = action;
        switch (type) {
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.successfulRegister,
                    successfulRegister: payload.successfulRegister,
                    successfulLogin: false,
                    error: payload.error,
                    guest: auth.guest,
                    emailCheck: auth.emailCheck
                })
            }

            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    successfulRegister: true,
                    successfulLogin: true,
                    error: null,
                    guest: auth.guest,
                    emailCheck: auth.emailCheck
                });
            }
            case AuthActionType.SET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    successfulRegister: false,
                    successfulLogin: payload.successfulLogin,
                    error: payload.error,
                    guest: false,
                    emailCheck: auth.emailCheck
                });
            }
            case AuthActionType.LOGOUT: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    successfulRegister: true,
                    successfulLogin: true,
                    error: null,
                    guest: auth.guest,
                    emailCheck: auth.emailCheck
                });
            }
            case AuthActionType.LOGIN_RETRY: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    successfulRegister: true,
                    successfulLogin: payload.successfulLogin,
                    error: null,
                    guest: auth.guest,
                    emailCheck: auth.emailCheck
                });
            }
            case AuthActionType.REGISTER_RETRY: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    successfulRegister: true,
                    successfulLogin: true,
                    error: null,
                    guest: auth.guest,
                    emailCheck: auth.emailCheck
                })
            }
            case AuthActionType.RESET_ERROR: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    successfulRegister: true,
                    successfulLogin: true,
                    error: null,
                    guest: auth.guest,
                    emailCheck: auth.emailCheck
                })
            }
            case AuthActionType.EMAIL_VERIFICATION: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    successfulRegister: auth.successfulRegister,
                    successfulLogin: auth.successfulLogin,
                    error: auth.error,
                    guest: auth.guest,
                    emailCheck: payload.emailCheck
                })
            }
        }
        
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.setLoggedIn = async function (userData) {
        try {
            const response = await api.loginUser(userData);
            console.log(response.data.user);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.success,
                        user: response.data.user,
                        successfulLogin: true
                    }
                });
                history("/home", [])
    
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    error: error.response.data.errorMessage,
                    successfulLogin: false
                }
            });
        }
    }

    auth.emailVerified = async function (userData) {
        try {
            const response = await api.emailVerified(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.success,
                        user: response.data.user,
                        successfulLogin: true
                    }
                });
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    error: error.response.data.errorMessage
                }
            });
        }        
    }

    auth.registerUser = async function(userData, store) {
        let response;
        try {
            response = await api.registerUser(userData);   
            if (response.status === 200) {
                console.log("New user registered with a verified email.");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        successfulRegister: true
                    }
                });
                history("/home", [])
            }
        }
        catch(error) {
            console.log(error.response);
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: null,
                    successfulRegister: false,
                    error: error.response.data.errorMessage
                }
            });
        }
    }

    auth.logoutUser = async function () { 
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT,
                payload: {
                    loggedIn: false,
                    user: null
                }
            });
        }
    }

    auth.retryLogin = function() {
        authReducer({
            type: AuthActionType.LOGIN_RETRY,
            payload: {
                user: null,
                successfulLogin: true
            }
        })
    }

    auth.retryRegister = function() {
        authReducer({
            type: AuthActionType.REGISTER_RETRY,
            payload: {
                user: null,
                successfulRegister: true
            }
        })
    }

    auth.setNewUserInfo = async function(userData) {     // for updating user information
       
        try {
            const response = await api.updateUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.success,
                        user: response.data.user,
                        successfulLogin: true
                    }
                });
                history("/accountSettings", [])
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: auth.user,
                    loggedIn: true,
                    error: error.response.data.errorMessage,
                    successfulLogin: false
                }
            });
        }
        
    }

    auth.updateUser = async function(userData) {
        try {
            const response = await api.updateUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.success,
                        user: response.data.user,
                        successfulLogin: true
                    }
                });
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    error: error.response.data.errorMessage,
                    successfulLogin: false
                }
            });
        }
    }

    auth.setNewPassword = async function(userData) {     // for updating user Password
        
        try {
            const response = await api.changePassword(userData);
            console.log(response.data.user);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.success,
                        user: response.data.user,
                        successfulLogin: true
                    }
                });
                history("/AccountSettings", [])
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    error: error.response.data.errorMessage,
                    successfulLogin: false
                }
            });
        }
        
    }

    auth.passwordReset = async function(userData) {     // for updating user Password
        
        try {
            const response = await api.passwordReset(userData);
            console.log(response.data.user);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.success,
                        user: response.data.user,
                        successfulLogin: true
                    }
                });
                history("/", [])
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    error: error.response.data.errorMessage,
                    successfulLogin: false
                }
            });
        }
        
    }


    auth.deleteUser = async function (userData){   // for deleting user information
        try {
            const response = await api.deleteUser(userData);
            console.log(response.data.user);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT,
                    payload: {
                        loggedIn: false,
                        user: null
                    }
                });
                history("/SignUp", [])
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    user: null, 
                    loggedIn: false,
                    error: error.response.data.errorMessage,
                    successfulLogin: false
                }
            });
        }


    }

    auth.resetError = async function(userData) {
        authReducer({
            type: AuthActionType.RESET_ERROR,
            payload: {}
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
export { AuthContextProvider };