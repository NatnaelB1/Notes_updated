import Box from '@mui/material/Box';
import "../App.css"
import React from'react';
import { useContext, useEffect, useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';

function TagArea(){
    const {auth} = useContext(AuthContext);
    const {store} = useContext(GlobalStoreContext)
    const [tags, setTags] = React.useState([]);
    
      const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
        store.activeNote.note_tags = store.activeNote.note_tags.filter((tag, index) => index !== i);
        console.log(store.activeNote.note_tags)

      };
    
      const handleAddition = tag => {
        setTags([...tags, tag]);
        store.activeNote.note_tags.push(tag);
        console.log(store.activeNote.note_tags)

      };
    
      const handleDrag = (tag, currPos, newPos) => {
        const newTags = store.activeNote.note_tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        
        // re-render
        setTags(newTags, currPos, newPos);
        
        store.activeNote.note_tags = newTags
        
      };
    
      const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
      };

    return(
        <Box 
          style={{padding: 0}}
          sx={{
              overflowY:'scroll', 
              height: '10vh',
              width:"70vw",
              padding: "0px 0px",
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
        <Box
          sx={{flex: 2, backgroundColor: "#ddd", paddingTop: "5px", paddingBottom: "5px"}}
        > 
            {!store.activeNote && <ReactTags       
            />}
            <ReactTags
              tags={store.activeNote ? store.activeNote.note_tags: tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              handleTagClick={handleTagClick}
              inputFieldPosition="bottom"
              autocomplete
              maxLength={35}
              autofocus={false}
              inline={true}
              allowAdditionFromPaste={true}
              editable={true}

              
            />
            
        </Box>
            
        </Box>
    )
}

export default TagArea;