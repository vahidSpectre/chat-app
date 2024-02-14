import { AttachFile, EmojiEmotions, MicNone } from '@mui/icons-material';
import {
  Fab,
  Fade,
  IconButton,
  Input,
  InputAdornment,
  Popover,
} from '@mui/material';
import React, { useState, useContext, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

import { AuthContext } from '../context/AuthContext';
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  increment,
} from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';

import './MessageFormInput.css';

const MessageFormInput = (props) => {
  const [newMessage, setNewMessage] = useState('');
  const [isContactOnline, setIsContactOnline] = useState(false);
  const [file, setFile] = useState('');
  const [anchorEl1, setAnchorEl1] = useState(null);
  const input = useRef();

  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };

  const open = Boolean(anchorEl1);
  const id = open ? 'simple-popover' : undefined;
  const { currentUser } = useContext(AuthContext);
  const refR = doc(db, 'messages', currentUser.uid);
  const refContact = doc(db, 'messages', props?.contactuid);
  const onlineStats = doc(db, 'offlineStats', `${props?.contactuid}`);
  const lastMessage = doc(db, 'lastMessage', `${props.contactuid}`);

  const date = new Date();
  const obj = {};
  const obj2 = {};

  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim('').length >= 1) {
      handleAdd(newMessage);
      setNewMessage('');
    }
    e.target[1].value = '';
  };

  const handleAdd = async (x) => {
    obj[props.contactuid] = arrayUnion(`${x}`, date);
    await updateDoc(refR, obj);

    obj2[currentUser.uid] = arrayUnion();
    await updateDoc(refContact, obj2);
    const h = onSnapshot(doc(db, 'offlineStats', props?.contactuid), (doc) => {
      const { online } = doc.data();
      setIsContactOnline(online);
    });
    await updateDoc(lastMessage, {
      [currentUser.uid]: newMessage,
    });

    if (!isContactOnline) {
      await updateDoc(onlineStats, {
        [currentUser.uid]: increment(1),
      });
    }
  };
  useEffect(() => {
    if (file?.name) {
      const storageRef = ref(
        storage,
        `media/${file?.name + Math.trunc(Math.random() * 9999)}.jpg`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case 'running':
              {
                console.log('ok');
              }
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (downloadURL.trim('').length !== 0) {
              handleAdd(downloadURL);
            }
          });
        }
      );
    }
  }, [file]);

  const addEmoji = (e) => {
    const refI = input.current;
    refI.focus();
    const start = newMessage.substring(0, ref.selectionStart);
    const text = start + e.emoji;
    refI.selectionEnd = refI.value.length;

    setNewMessage(text);
  };

  return (
    <form
      onSubmit={handleNewMessage}
      style={{
        alignSelf: 'center',
        position: 'relative',
        bottom: '1%',
        width: '100%',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Input
        value={newMessage}
        sx={{
          width: '70%',
          maxWidth: '35rem',
          backgroundColor: 'white',
          ml: '20px',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '10px',
          paddingRight: '20px',
          borderRadius: '13px',
          letterSpacing: '.1rem',
          fontSize: '1.1rem',
        }}
        onChange={(e) => {
          setNewMessage(e.target.value);
        }}
        disableUnderline={true}
        size="medium"
        inputRef={input}
        startAdornment={
          <InputAdornment position="start">
            <IconButton
              sx={{
                width: '2.8rem',
                height: '2.8rem',
                borderRadius: '50%',
                p: '',
                m: '0',
                position: 'relative',
              }}
              onClick={handleClick}
              aria-describedby={id}
            >
              <EmojiEmotions
                sx={{
                  width: '1.8rem',
                  height: '1.8rem',
                  borderRadius: '50%',
                  p: '',
                  m: '0',
                }}
              />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <input
              type={'file'}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                position: 'absolute',
                opacity: '0',
                zIndex: '2',
                cursor: 'pointer',
              }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <IconButton
              sx={{
                transform: 'rotate(45deg)',
                cursor: 'pointer',
              }}
            >
              <AttachFile
                sx={{
                  pr: '20px',
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  p: '0',
                  m: '0',
                  cursor: 'pointer',
                }}
              />
            </IconButton>
          </InputAdornment>
        }
      />
      <Popover
        id={id}
        anchorEl={anchorEl1}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            transform: 'scale(.5) translate(-50%,-4.5rem)',
            overflowY: 'hidden',
          },
        }}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 0 }}
      >
        <div>
          <EmojiPicker
            emojiStyle="apple"
            searchDisabled="true"
            onEmojiClick={addEmoji}
            previewConfig={{ showPreview: false }}
          />
        </div>
      </Popover>
    </form>
  );
};

export default MessageFormInput;
