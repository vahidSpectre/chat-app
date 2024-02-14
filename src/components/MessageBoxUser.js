import React, { useState, useEffect, useContext } from 'react';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';

import './MessageBoxUser.css';
import { ThemeContext } from '../context/ThemeContext';

const MessageBoxUser = (props) => {
  const [messageIsMedia, setMessageIsMedia] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaModal, setMediaModal] = useState(false);
  const { MBcolor, SideU, Font, FontSize } = useContext(ThemeContext);

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
        flexDirection: 'row-reverse',
        backgroundColor: 'transparent',
        maxWidth: `${messageIsMedia ? '30%' : '70%'}`,
        width: 'auto',
        height: 'fit-content',
        marginRight: '.5rem',
        alignSelf: 'end',
      }}
      ref={props.refs}
    >
      <Modal
        open={mediaModal}
        onClose={handleMediaModalClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
      <Box
        className="messageboxuser"
        sx={{
          height: 'fit-content',
          display: 'flex',
          flexDirection: `${messageIsMedia ? 'column' : 'row'}`,
          maxWidth: '100%',
          minHeight: '1.3rem',
          borderRadius: '.7rem .7rem 0rem .7rem',
          backgroundColor: 'white',
          p: '.25rem .5rem .25rem .5rem',
          m: '.5rem',
          lineHeight: '1.5rem',
          wordBreak: 'break-word',
          position: 'relative',
          boxShadow: '2px 2px 5px -3px rgba(0,0,0,.7)',
          background: `${MBcolor}`,
          ':before': { backgroundColor: `${SideU}` },
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
                width: '100%',
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
            marginLeft: '.5rem',
            fontSize: '.7rem',
            alignSelf: 'flex-end',
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

export default MessageBoxUser;
