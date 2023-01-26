import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: '/api',
})

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/login/`, payload)
export const logoutUser = () => api.get(`/logout/`)
export const updateUser = (payload) => api.put(`/user/`, payload)
export const deleteUser = (payload) => api.delete(`/user/`, {data: {id: payload}})
export const changePassword = (payload) => api.put(`/changePassword/`, payload)
export const emailVerified = (payload) => api.post(`/emailVerified/`, payload)
export const passwordReset = (payload) => api.put(`/passwordReset/`, payload)

export const createNote = (payload) => api.post(`/createNote/`, payload)
export const getAllNoteByUser = (payload) => api.get(`/getAllNoteByUser/`, {params: {_id: payload}})
export const getAllSharedNotesByUser = (payload) => api.get(`/getAllSharedNotesByUser/`, {params: {_id: payload}})
export const updateNote = (payload) => api.put(`/updateNote/`, payload)
export const deleteNote = (payload) => api.delete(`/deleteNote/`, {data: {deleteObject: payload}})

const apis= {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    changePassword,
    emailVerified,
    passwordReset,
    createNote,
    getAllNoteByUser,
    getAllSharedNotesByUser,
    updateNote,
    deleteNote
}

export default apis;