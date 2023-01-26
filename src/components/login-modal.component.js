import { Button, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import "../App.css"
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const LoginModal = ({message, onClose, closeButtonText, onClose2}) => {
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: "#ede4e4",
        color: "#f70505",
        // backgroundImage :'linear-gradient(to bottom, #505051, #303031)',
        border: '2px solid #FFF',
        boxShadow: 24,
        p: 4,
      };

      let extraButton = onClose2 ? <Button variant="contained" color="error" onClick={onClose2} sx={{marginLeft:2}}>Close</Button> : null

    return(
        <Box color="white">
        <Modal
            open={true}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>

            <Typography fontSize="20px">
                <Box className="qmodal-text" color="f70505">{message}</Box>
            </Typography>
            <Button variant="contained" color="error" onClick={onClose}>{closeButtonText ? closeButtonText:"Close"}</Button>
            {extraButton}
            </Box>
        </Modal>
        </Box> 
    )}

export default LoginModal;