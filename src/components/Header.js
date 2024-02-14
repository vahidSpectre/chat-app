import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SignInForm from './SignInForm';

import './Header.css';

const Header = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar style={{ height: '1vh' }}>
            <Typography
              variant="dense"
              component="div"
              sx={{
                flexGrow: 1,
              }}
            >
              Chatting App
            </Typography>
            <Button
              color="inherit"
              onClick={handleOpen}
              variant="outlined"
              size="small"
            >
              Sign In
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box className="style">
          <center>
            <SignInForm />
          </center>
        </Box>
      </Modal>
    </div>
  );
};

export default Header;
