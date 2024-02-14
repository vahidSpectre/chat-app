import React, { useState, useEffect, useContext } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Modal,
  Typography,
} from '@mui/material';

import { ThemeContext } from '../context/ThemeContext';

import './MessageBoxContact.css';
const MessageBoxContact = (props) => {
  const [messageIsMedia, setMessageIsMedia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaModal, setMediaModal] = useState(false);
  const { MBcolor, SideC, Font, FontSize } = useContext(ThemeContext);

  useEffect(() => {
    if (
      props.message.includes('media') &&
      props.message.includes('https://firebasestorage.googleapis.com')
    ) {
      setMessageIsMedia(true);
    }
  }, [props.message]);

  const handleMediaModalClose = () => setMediaModal(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: `${messageIsMedia ? '35%' : '70%'}`,
        backgroundColor: 'transparent',
        height: 'fit-content',
        marginLeft: '1rem',
      }}
      ref={props.refs}
    >
      <Modal
        open={mediaModal}
        onClose={handleMediaModalClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
        }}
      >
        <Box
          sx={{
            maxWidth: '50vw',
            maxHeight: '100vh',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255)',
          }}
        >
          <img
            src={`${props.message}`}
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
      <Avatar
        src={props.imageUrl}
        sx={{
          alignSelf: 'end',
          mb: '.5rem',
          boxShadow: '0px 1px 5px 0px rgba(0,0,0,.5)',
        }}
      ></Avatar>
      <Box
        className="messagebox"
        sx={{
          height: 'fit-content',
          display: 'flex',
          flexDirection: `${messageIsMedia ? 'column' : 'row-reverse'}`,
          maxWidth: '100%',
          minHeight: '1.3rem',
          borderRadius: '.7rem .7rem .7rem 0',
          background: { MBcolor },
          p: '.25rem .5rem .25rem .5rem',
          m: '.5rem',
          lineHeight: '1.5rem',
          wordBreak: 'break-word',
          position: 'relative',
          boxShadow: '2px 2px 5px -3px rgba(0,0,0,.7)',
          background: `${MBcolor}`,
          ':before': { background: `${SideC}` },
        }}
      >
        {!messageIsMedia ? (
          <Typography sx={{ fontFamily: `${Font}`, fontSize: `100%` }}>
            {props.message}
          </Typography>
        ) : (
          <div
            style={{
              width: 'inherit',
              height: 'inherit',
              marginTop: '.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                height: '8rem',
                width: '8rem',
                display: `${isLoading ? 'flex' : 'none'}`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size="1rem" />
            </span>
            <span
              style={{
                display: `${isLoading ? 'none' : 'block'}`,
                cursor: 'pointer',
              }}
              onClick={() => setMediaModal(true)}
            >
              <img
                style={{
                  height: 'auto',
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '.7rem',
                }}
                src={`${props.message}`}
                onLoad={() => setIsLoading(false)}
              ></img>
            </span>
          </div>
        )}
        <span
          style={{
            width: 'auto',
            marginRight: '.5rem',
            fontSize: '.7rem',
            alignSelf: 'flex-start',
            whiteSpace: 'nowrap',
            color: 'blue',
          }}
        >
          {props.time}
        </span>
      </Box>
    </div>
  );
};

export default MessageBoxContact;
