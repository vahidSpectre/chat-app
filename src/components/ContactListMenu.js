import {
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Switch,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import React, { useState, useContext, useEffect, memo } from 'react';
import { Logout, ModeNight, Settings, WbSunny } from '@mui/icons-material';
import { updateDoc, doc } from 'firebase/firestore';

import './ContactListMenu.css';

import { AuthContext } from '../context/AuthContext';
import NightModeContext from '../context/NightModeContext';
import { ThemeContext } from '../context/ThemeContext';
import { db } from '../firebase/firebase';
import ContactListMenuOptionsProfile from './ContactListMenuOptionsProfile';
import ContactListMenuSettings from './ContactListMenuSettings';

const ContactListMenu = (props) => {
  const [checked, setChecked] = React.useState(['wifi']);
  const [open, setOpen] = useState(false);
  const [optionProfile, setOptionProfile] = useState(false);
  const [optionSettings, setOptionSettings] = useState(false);
  const [profileComponent, setProfileComponent] = useState(false);
  const [settingsComponent, setSettingsComponent] = useState(false);
  const { dispach, currentUser } = useContext(AuthContext);
  const ModeCTX = useContext(NightModeContext);
  const { Font, FontSize } = useContext(ThemeContext);
  const mode = ModeCTX.context.mode;
  const onlineStats = doc(db, 'offlineStats', `${currentUser.uid}`);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleLogOut = async () => {
    await updateDoc(onlineStats, {
      online: false,
    });
    setTimeout(() => {
      dispach({ type: 'LOGOUT', payload: currentUser });
    }, 100);
  };
  const handleLogOutModalOpen = () => setOpen(true);
  const handleLogOutModalClose = () => setOpen(false);
  const handleNightMode = () => {
    if (checked.indexOf('wifi') === -1) {
      ModeCTX.context.toggle(true);
    }
    if (checked.indexOf('wifi') !== -1) {
      ModeCTX.context.toggle(false);
    }
  };
  const handleShowProfile = () => {
    setOptionProfile(true);
  };
  useEffect(() => {
    setTimeout(() => {
      setProfileComponent(optionProfile);
    }, 1);
  }, [optionProfile]);
  const handleShowSettings = () => {
    setOptionSettings(true);
  };
  useEffect(() => {
    setTimeout(() => {
      setSettingsComponent(optionSettings);
    }, 1);
  }, [optionSettings]);

  return (
    <>
      <Modal
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0,0,0,.2)',
          },
        }}
        open={open}
        onClose={handleLogOutModalClose}
        className="center"
      >
        <Box className="modal-box center">
          <span className="modal-box-span-text">
            <Typography sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}>
              Do you want log out?
            </Typography>
          </span>
          <span className="modal-box-span-btn">
            <Button
              size="large"
              color="success"
              variant="outlined"
              onClick={handleLogOutModalClose}
              sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
            >
              no
            </Button>
            <Button
              size="large"
              color="error"
              variant="outlined"
              onClick={handleLogOut}
              sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
            >
              yes
            </Button>
          </span>
        </Box>
      </Modal>

      <div style={{ display: 'flex', width: '100%', height: 'auto' }}>
        <div
          style={{
            display: `${optionProfile || optionSettings ? 'none' : 'flex'}`,
            width: '100%',
            height: 'auto',
            flexDirection: 'column',
          }}
        >
          <ListItemButton onClick={handleShowProfile} sx={{ pl: '.5rem' }}>
            <ListItemIcon>
              <Avatar src={`${props.imageUrl}`} />
            </ListItemIcon>
            <ListItemText
              sx={{
                color: `${mode ? 'black' : 'white'}`,
              }}
            >
              <Typography
                sx={{
                  fontFamily: `${Font}`,
                  fontSize: `${FontSize}`,
                }}
              >
                View profile
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton onClick={handleShowSettings}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText sx={{ color: `${mode ? 'black' : 'white'}` }}>
              <Typography
                sx={{
                  fontFamily: `${Font}`,
                  fontSize: `${FontSize}`,
                }}
              >
                Settings
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItem>
            <ListItemIcon>
              {mode ? (
                <WbSunny sx={{ color: 'rgb(255, 196, 0)' }} />
              ) : (
                <ModeNight sx={{ color: 'black' }} />
              )}
            </ListItemIcon>
            <ListItemText id="switch-list-label-wifi" />
            <Switch
              onClick={handleNightMode}
              size="small"
              edge="end"
              onChange={handleToggle('wifi')}
              checked={!mode}
              inputProps={{
                'aria-labelledby': 'switch-list-label-wifi',
              }}
            />
          </ListItem>
          <ListItemButton
            sx={{
              transition: 'all .2 ease-in-out',
              ':hover': {
                backgroundColor: `${
                  mode ? 'rgba(255,0,0,.5)' : 'rgba(255,0,0,.2)'
                }`,
              },
            }}
            onClick={handleLogOutModalOpen}
          >
            <ListItemIcon>
              <Logout sx={{ color: `${mode ? 'black' : 'red'}` }} />
            </ListItemIcon>
            <ListItemText sx={{ color: `${mode ? 'black' : 'white'}` }}>
              <Typography
                sx={{
                  fontFamily: `${Font}`,
                  fontSize: `${FontSize}`,
                }}
              >
                Log out
              </Typography>
            </ListItemText>
          </ListItemButton>
        </div>
        <div
          style={{
            display: `${optionProfile ? 'flex' : 'none'}`,
            width: '100%',
            height: 'auto',
            flexDirection: 'column',
          }}
        >
          <ContactListMenuOptionsProfile
            open={profileComponent}
            onClose={() => {
              setProfileComponent(false);
              setTimeout(() => {
                setOptionProfile(false);
              }, 200);
            }}
            bio={props.bio}
            userName={props.userName}
            imageUrl={props.imageUrl}
          />
        </div>
        <div
          style={{
            display: `${optionSettings ? 'flex' : 'none'}`,
            width: '100%',
            height: 'auto',
            flexDirection: 'column',
          }}
        >
          <ContactListMenuSettings
            open={settingsComponent}
            onClose={() => {
              setSettingsComponent(false);
              setTimeout(() => {
                setOptionSettings(false);
              }, 200);
            }}
            userName={props.userName}
          />
        </div>
      </div>
    </>
  );
};

export default memo(ContactListMenu);
