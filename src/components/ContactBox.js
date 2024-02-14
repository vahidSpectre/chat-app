import React, { useEffect, useState, useContext, memo } from 'react';
import {
  Avatar,
  Box,
  Skeleton,
  Typography,
  Badge,
  Modal,
  Button,
} from '@mui/material';
import {
  doc,
  getDoc,
  updateDoc,
  deleteField,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MoreVert, Delete, PushPin } from '@mui/icons-material';
import styled from '@emotion/styled';

import './ContactBox.css';
import { AuthContext } from '../context/AuthContext';
import NightModeContext from '../context/NightModeContext';
import { ThemeContext } from '../context/ThemeContext';

const ContactBox = (props) => {
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [menu, setMenu] = useState(false);
  const [offlineMessageCount, setOfflineMessageCount] = useState(0);
  const [isContactOnline, setIsContactOnline] = useState(false);
  const [display, setDisplay] = useState(true);
  const [contactDeletModalOpen, setContactDeletModalOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [lastMessageDisplay, setLastMessageDisplay] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const NightModeCTX = useContext(NightModeContext);
  const mode = NightModeCTX.context.mode;
  const { Font, FontSize } = useContext(ThemeContext);

  useEffect(() => {
    const getCurrentUserData = async () => {
      const docRef = doc(db, 'users', props.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserName(docSnap.data().username);
        setImageUrl(docSnap.data().imgUrl);
      }
      const h = onSnapshot(doc(db, 'offlineStats', props.uid), (doc) => {
        const { online } = doc.data();
        setIsContactOnline(online);
      });
      const f = onSnapshot(doc(db, 'offlineStats', currentUser.uid), (doc) => {
        const { [`${props.uid}`]: data } = doc.data();
        setOfflineMessageCount(data);
      });
      const q = onSnapshot(doc(db, 'lastMessage', currentUser.uid), (doc) => {
        const { [`${props.uid}`]: data } = doc.data();
        setLastMessageDisplay(true);
        setLastMessage(data);
      });
    };

    getCurrentUserData();
  }, []);

  const handleDeletContact = async (e) => {
    e.stopPropagation();
    handleContactDeletModalClose();
    setDisplay(false);
    const contact = doc(db, 'messages', currentUser.uid);
    await updateDoc(contact, {
      [props.uid]: deleteField(),
    });

    const contactC = doc(db, 'messages', props.uid);
    await updateDoc(contactC, {
      [currentUser.uid]: deleteField(),
    });
    const contactR = doc(db, 'offlineStats', currentUser.uid);
    await updateDoc(contactR, {
      [props.uid]: 0,
    });

    const contactCT = doc(db, 'offlineStats', props.uid);
    await updateDoc(contactCT, {
      [currentUser.uid]: 0,
    });
  };
  const handleMenuOpen = (e) => {
    e.stopPropagation();
    menu ? setMenu(false) : setMenu(true);
  };
  const handleMenuClose = (e) => {
    e.stopPropagation();

    setTimeout(() => {
      setMenu(false);
    }, 500);
  };
  const handlePinContact = (e) => {
    e.stopPropagation();
    console.log('ok');
  };

  const handleContactDeletModalClose = () => setContactDeletModalOpen(false);
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: 'rgb(153, 255, 0)',
    },
  }));
  const StyledBadge2 = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: `${mode ? 'red' : 'rgba(4, 0, 255)'}`,
      color: 'rgb(255, 255, 255)',
    },
  }));

  const handleResetLastMessage = async () => {
    setLastMessageDisplay(false);
    await updateDoc(doc(db, 'lastMessage', `${currentUser.uid}`), {
      [props.uid]: '',
    });
  };
  return (
    <Box
      className={`contact-box ${
        contactDeletModalOpen ? 'delet-animation' : ''
      }`}
      sx={{
        width: '98%',
        height: '4.5rem',
        backgroundColor: `${mode ? 'white' : 'rgba(10, 10, 10,.3)'}`,
        boxShadow: `${
          mode ? 'none' : 'inset 0px 0px 45px rgba(255, 255, 255)'
        }`,
        borderRadius: '1rem',
        display: 'flex',
        opacity: `${display ? '1' : '0'}`,
        transition: 'all .5s',
        overflow: 'hidden',
        alignSelf: 'center',
        justifyContent: 'space-between',
        mt: '.1rem',
        backdropFilter: `${mode ? 'none' : 'blur(4px)'}`,
        ':hover': {
          backgroundColor: `${
            mode ? 'rgba(10, 10, 10,.1)' : 'rgba(10, 10, 10,.6)'
          }`,
          boxShadow: `${
            mode ? 'none' : 'inset 0px 0px 45px rgba(230, 230, 230)'
          }`,
        },
      }}
      onClick={props.onClick}
      onClickCapture={handleResetLastMessage}
    >
      <div
        style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Modal
          open={contactDeletModalOpen}
          onClose={handleContactDeletModalClose}
          BackdropProps={{
            style: {
              backgroundColor: 'rgba(0,0,0,.2)',
            },
          }}
          className=" center"
        >
          <Box className="modal-box-c">
            <span className="modal-box-span-textc center">
              <Typography
                sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
              >
                By accepting this alert all messages between you and this
                contact will be eraised.
              </Typography>
            </span>
            <span className="modal-box-span-btnc">
              <Button
                size="large"
                color="success"
                variant="outlined"
                onClick={handleContactDeletModalClose}
                sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
              >
                Reject
              </Button>
              <Button
                size="large"
                color="error"
                variant="outlined"
                onClick={handleDeletContact}
                sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}
              >
                Accept
              </Button>
            </span>
          </Box>
        </Modal>
        <div
          style={{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {imageUrl || userName.charAt(0) !== '' ? (
            <>
              <StyledBadge
                className="badge"
                variant="dot"
                badgeContent={''}
                sx={{ display: `${isContactOnline ? 'flex' : 'none'}` }}
              ></StyledBadge>
              <Avatar
                src={imageUrl}
                sx={{
                  width: '3.5rem',
                  height: '3.5rem',
                  fontSize: '2rem',
                  border: '1.2px solid rgb(255,255,255)',
                }}
              >
                {userName.charAt(0)}
              </Avatar>
            </>
          ) : (
            <Skeleton
              variant="circular"
              width={'3rem'}
              height={'3rem'}
            ></Skeleton>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            textAlign: 'left',
          }}
        >
          {userName ? (
            <Typography
              sx={{
                width: '8.5rem',
                height: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: `${mode ? 'balck' : 'white'}`,
                fontFamily: `${Font}`,
                fontSize: `${FontSize}`,
                display: 'flex',
                alignItems: 'center',
                fontWeight: '300',
              }}
              variant="h6"
              fontSize={'1.1rem'}
              fontWeight={'bolder'}
            >
              {userName}
            </Typography>
          ) : (
            <Skeleton width={'8.5rem'} height={'1.4rem'}></Skeleton>
          )}
          {lastMessage === undefined || lastMessage || lastMessage === '' ? (
            <Typography
              variant="body1"
              fontSize={'.8rem'}
              color={'RGBA(0,0,0,0.5)'}
              sx={{
                width: '8.5rem',
                height: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: `${mode ? 'balck' : 'white'}`,
                fontFamily: `${Font}`,
                fontSize: `${FontSize}`,
                display: 'flex',
                alignItems: 'center',
                fontWeight: '900',
              }}
            >
              {lastMessage}
            </Typography>
          ) : (
            <Skeleton width={'10rem'} height={'1.3rem'}>
              {''}
            </Skeleton>
          )}
        </div>
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
          mr: '1.5rem',
        }}
      >
        <div
          style={{
            transition: 'all .2s',
            transform: `scaleX(${menu ? '100%' : '0%'})`,
            transformOrigin: '100% 0%',
            width: 'auto',
            display: 'flex',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            onClick={() => setContactDeletModalOpen(true)}
            sx={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              transition: 'all .25s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              ml: '.2rem',
              color: `${mode ? 'black' : 'white'}`,

              ':hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                transition: 'all .25s',
                fontSize: '1.2rem',
              },
            }}
          >
            <Delete fontSize="inherit" />
          </Box>
        </div>
        <button
          onClick={handleMenuOpen}
          onBlur={handleMenuClose}
          style={{
            border: 'none',
            width: '1.7rem',
            height: '1.7rem',
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: `${mode ? 'black' : 'white'}`,
          }}
        >
          <MoreVert
            sx={{
              transition: 'all .2s',
              transform: `rotate(${menu ? '-90deg' : '0'})`,
            }}
          />
        </button>
        <StyledBadge2
          badgeContent={`${offlineMessageCount}`}
          color="error"
          sx={{
            ml: '10%',
            opacity: `${
              offlineMessageCount !== 0 && offlineMessageCount !== undefined
                ? '1'
                : '0'
            }`,
            transition: 'all .2s',
          }}
        ></StyledBadge2>
      </Box>
    </Box>
  );
};

export default memo(ContactBox);
