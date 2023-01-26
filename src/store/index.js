import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useHistory, useNavigate } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth';

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext();

export const GlobalStoreActionType = {
    LOAD_USER_NOTES: "LOAD_USER_NOTES",
    LOAD_SHARED_NOTES: "LOAD_SHARED_NOTES",
    SET_THE_CURRENT_NOTE: "SET_THE_CURRENT_NOTE",
    SET_THE_NOTE_MARKED_FOR_DELETION: "SET_THE_NOTE_MARKED_FOR_DELETION",
    SET_THE_SEARCH_QUERY: "SET_THE_SEARCH_QUERY"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        userNotes: [],                      //holds all the notes created by the user
        sharedNotes: [],                    //holds all the notes created by the user
        activeNote: {},                     //holds the current note opened for editing
        currentTags: [],                    //holds the current Tags opened for editing
        searchQuery: ""                     //holds search query
    });

    const {auth} = useContext(AuthContext);
    const navigate= useNavigate();

    const get_Date = () => {

        var today = new Date();
        let day = today.getDate();
        let month = today.getMonth()+1;
        let year = today.getFullYear();
        let hour = today.getHours()% 12 || 12;
        let min = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        let sec = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
        let ampm = today.getHours() >= 12 ? 'PM' : 'AM';
        var final_date = month +"/"+ day +"/"+year+", " +hour+':'+min+':'+ sec + " "+ ampm;
        return final_date;
    }
    

    const storeReducer = (action) => {
        const {type, payload} = action;
        switch(type) {
            case GlobalStoreActionType.LOAD_USER_NOTES:
                return setStore({
                    userNotes: payload.userNotes,
                    sharedNotes: store.sharedNotes,
                    activeNote: store.activeNote,
                    currentTags: store.currentTags,
                    searchQuery: store.searchQuery
                })
            case GlobalStoreActionType.LOAD_SHARED_NOTES:
                return setStore({
                    userNotes: store.userNotes,
                    sharedNotes: payload.sharedNotes,
                    activeNote: store.activeNote,
                    currentTags: store.currentTags,
                    searchQuery: store.searchQuery
                })
            case GlobalStoreActionType.SET_THE_CURRENT_NOTE:
                return setStore({
                    userNotes: store.userNotes,
                    sharedNotes: store.sharedNotes,
                    activeNote: payload.activeNote,
                    currentTags: store.currentTags,
                    searchQuery: store.searchQuery
                })
            case GlobalStoreActionType.SET_THE_SEARCH_QUERY:
                return setStore({
                    userNotes: store.userNotes,
                    sharedNotes: store.sharedNotes,
                    activeNote: store.activeNote,
                    currentTags: store.currentTags,
                    searchQuery: payload.searchQuery
                })
            case GlobalStoreActionType.SET_THE_NOTE_MARKED_FOR_DELETION:
                return setStore({
                    userNotes: store.userNotes,
                    sharedNotes: store.sharedNotes,
                    activeNote: payload.activeNote,
                    currentTags: store.currentTags,
                    searchQuery: store.searchQuery
                })
            default:
                return store;
        }}
    ;

    store.createNote = async function(newNote){
        let response;
        newNote.lastModified = get_Date()
     
        try {
            response = await api.createNote(newNote);
            if (response.status === 200) {
                storeReducer({
                type: GlobalStoreActionType.SET_THE_CURRENT_NOTE,
                    payload: {
                        activeNote: response.data.Note,
    
                }});
            }
        }
        catch(error){
        storeReducer({
            type: GlobalStoreActionType.SET_THE_CURRENT_MAP,
            payload: {
                currentMap: {},
                mapInfo: {}
            }
        });
        }

    }

    store.getUserNotes = async function(_id){
        let response = await api.getAllNoteByUser(_id)
        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_NOTES,
                payload: {
                    userNotes: response.data.notes
                }
            });
            return response.data.notes
        }    
        
    }

    store.searchResult = async function(searchQuery){
        console.log(searchQuery)
        storeReducer({
            type: GlobalStoreActionType.SET_THE_SEARCH_QUERY,
            payload: {
                searchQuery: searchQuery
            }
        });
        
    }

    store.getSharedNotes = async function(_id){
        let response = await api.getAllSharedNotesByUser(_id)
        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_SHARED_NOTES,
                payload: {
                    sharedNotes: response.data.shared_notes
                }
            });
            return response.data.shared_notes
        }    
    }
    store.deleteNote = async function(activeNoteId, userId){
        const updatedStore = store.userNotes.filter(note => note._id !== activeNoteId)
        storeReducer({
            type: GlobalStoreActionType.LOAD_USER_NOTES,
            payload: {
                userNotes: updatedStore
            }
        })
        const deleteObject = {
            _id: activeNoteId,
            loggedInUser_id: userId
        }
         
        await api.deleteNote(deleteObject)
        return updatedStore        
    }

    store.saveNote = async function (){

    }

    store.updateNote = async function (updatedNote, username){
        updatedNote.lastModified = get_Date()

        const updateObject = {
            _id: updatedNote._id,
            notebody: updatedNote.notebody ,
            lastModified: updatedNote.lastModified,
            creator: username,
            note_tags: updatedNote.note_tags
        }

        const updatedStore = store.userNotes.map(note => note._id === updatedNote._id ? note = updatedNote : note)  
        storeReducer({
            type: GlobalStoreActionType.LOAD_USER_NOTES,
            payload: {
                userNotes: updatedStore
            }
        })
        await api.updateNote(updateObject);  
        return updatedStore

    }
    store.setActiveNote = async function (note){
        console.log(note)
        storeReducer({
            type: GlobalStoreActionType.SET_THE_CURRENT_NOTE,
            payload: {
                activeNote: note
            }
        });
        return note
    }
    return (
        <GlobalStoreContext.Provider value={{store}}>
            {props.children}
        </GlobalStoreContext.Provider>
    );

}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };