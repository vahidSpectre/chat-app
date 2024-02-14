import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Skeleton,
  Modal,
  Box,
} from '@mui/material';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import NightModeContext from '../context/NightModeContext';
import { AuthContext } from '../context/AuthContext';
import MessageFormInput from './MessageFormInput';
import MessagesContainer from './MessagesContainer';
import { ThemeContext } from '../context/ThemeContext';

import './Messages.css';
import glass from '../Pics/glass.jpg';
const Messages = (props) => {
  const [bio, setBio] = useState('');
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [cUid, setCUid] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [bgUrl, setBgUrl] = useState('');

  const NightModeCTX = useContext(NightModeContext);
  const { currentUser } = useContext(AuthContext);
  const { Font, FontSize } = useContext(ThemeContext);

  const mode = NightModeCTX.context.mode;

  useEffect(() => {
    const getCurrentContactData = async () => {
      const docRef = doc(db, 'users', props.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBio(docSnap.data().bio);
        setUserName(docSnap.data().username);
        setImageUrl(docSnap.data().imgUrl);
        setCUid(docSnap.data().uid);
      }
    };
    getCurrentContactData();
  }, [props.uid]);

  useEffect(() => {
    const getUserBackgroundUrl = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setBgUrl(docSnap.data().backgroundImgUrl);
        }
      }
    );
    const bg = JSON.parse(localStorage.getItem('bgUrl'));
    bg === '' ? getUserBackgroundUrl() : setBgUrl(bg);
  }, [currentUser.uid]);

  const handleProfilePhotoModalOpen = () => {
    imageUrl ? setOpenModal(true) : setOpenModal(false);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const liftNewMessage = (elem) => {
    setNewMessage(elem);
  };

  return (
    <div
      className="messages-body"
      style={{
        filter: `${mode ? 'brightness(100%)' : 'brightness(90%)'}`,
        backgroundImage: `url('${bgUrl}')`,
        backgroundPosition: '50% 50%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <img
          src={`${bgUrl}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
      <Modal open={openModal} onClose={handleClose} className="center">
        <Box className="contact-container">
          <div
            style={{
              background: `url(${imageUrl})`,
              backgroundSize: '100%',
            }}
            className="contact-container-bgimg center"
          >
            <div className="contact-container-img-bg center">
              <img src={imageUrl} className="contact-container-img"></img>
            </div>
          </div>
          <div className="contact-container-info">
            <span className="contact-container-info-name">
              <Typography
                variant="body2"
                sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
              >
                User name:
              </Typography>
              <div className="contact-container-info-con">
                <Typography
                  sx={{
                    wordBreak: 'break-word',
                    fontFamily: `${Font}`,
                    fontSize: `${FontSize}`,
                  }}
                >
                  {userName}
                </Typography>
              </div>
            </span>
            <span className="contact-container-info-bio">
              <Typography
                variant="body2"
                sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
              >
                Bio:
              </Typography>
              <div className="contact-container-info-con">
                <Typography
                  sx={{
                    wordBreak: 'break-word',
                    fontFamily: `${Font}`,
                    fontSize: `${FontSize}`,
                  }}
                >
                  {bio}
                </Typography>
              </div>
            </span>
          </div>
        </Box>
      </Modal>
      {cUid ? (
        <>
          <AppBar
            position="fixed"
            className="app-bar"
            sx={{
              backgroundImage: `${mode ? 'none' : `url(${glass}) !important`}`,
              backgroundSize: '25%',
            }}
          >
            <Toolbar>
              {imageUrl || userName.charAt(0) !== '' ? (
                <Avatar
                  sx={{
                    width: '3rem',
                    height: '3rem',
                    cursor: 'pointer',
                    fontSize: '2rem',
                    border: '1px solid white',
                  }}
                  src={imageUrl}
                  onClick={handleProfilePhotoModalOpen}
                >
                  {userName.charAt(0)}
                </Avatar>
              ) : (
                <Skeleton
                  variant="circular"
                  width={'3rem'}
                  height={'3rem'}
                ></Skeleton>
              )}
              <Typography
                sx={{
                  width: '8.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: `${Font}`,
                  fontSize: `${FontSize}`,
                }}
                variant="h6"
                color={mode ? 'black' : 'white'}
                ml={'10px'}
              >
                {userName}
              </Typography>
            </Toolbar>
          </AppBar>
          <MessagesContainer
            contactuid={cUid}
            message={newMessage}
            imageUrl={imageUrl}
          />
          <MessageFormInput contactuid={cUid} newmassage={liftNewMessage} />
        </>
      ) : (
        <div
          className="center"
          style={{ height: '100vw', backgroundColor: 'transparent' }}
        >
          <Typography>Select your contact and start CHATTING!</Typography>
        </div>
      )}
    </div>
  );
};

export default Messages;
