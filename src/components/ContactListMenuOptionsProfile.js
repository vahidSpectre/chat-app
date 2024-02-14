import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrowBack, Info } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Icon,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { AuthContext } from '../context/AuthContext';
import NightModeContext from '../context/NightModeContext';
import { ThemeContext } from '../context/ThemeContext';

const ContactListMenuOptionsProfile = (props) => {
  const [file, setFile] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState(false);
  const [fileUpladProgress, setFileUpladProgress] = useState(false);
  const [data, setData] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const nightModeCTX = useContext(NightModeContext);
  const { Font, FontSize } = useContext(ThemeContext);
  const mode = nightModeCTX.context.mode;

  const userName = useRef();
  const bio = useRef();

  const documentCollectionRef = collection(db, 'users');
  const users = doc(db, 'users', `${currentUser.uid}`);

  useEffect(() => {
    const userNameValidation = async () => {
      const data = await getDocs(documentCollectionRef);
      setData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    userNameValidation();
  }, []);
  useEffect(() => {
    data.map((elem) => {
      setAllUserNames((pre) => [...pre, elem.username]);
    });
  }, [data]);

  useEffect(() => {
    if (file?.name) {
      const storageRef = ref(
        storage,
        `profileImages/${file?.name + Math.trunc(Math.random() * 9999)}.jpg`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      setFileUpladProgress(true);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress === 100) setFileUpladProgress(false);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (
              downloadURL.trim('').length !== 0 &&
              downloadURL !== props.imageUrl
            ) {
              setNewImageUrl(downloadURL);
            }
          });
        }
      );
    }
  }, [file]);

  useEffect(() => {
    for (let i = 0; i < allUserNames.length; i++) {
      if (
        newUserName === allUserNames[i] ||
        newUserName === '' ||
        newUserName.trim('').length < 5
      ) {
        if (newUserName === props.userName) {
          setError(false);
        } else {
          setError(true);
        }
        break;
      } else {
        setError(false);
      }
    }
  }, [newUserName]);

  const handleUpdateProfile = async () => {
    await updateDoc(users, {
      username: `${newUserName ? newUserName : props.userName}`,
      bio: `${newBio ? newBio : props.bio}`,
      imgUrl: `${newImageUrl ? newImageUrl : props.imageUrl}`,
    });
  };

  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        backgroundColor: 'transparent',
        transition: 'all .2s',
        transform: `translateX(${props.open ? '0%' : '100%'})`,
        zIndex: '10',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          minHeight: '2.5rem',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          style={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,.15)',
            position: 'absolute',
            left: '0',
            border: 'none',
            margin: '0 0 .5rem .5rem',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all .25s',
          }}
          onClick={props.onClose}
        >
          <ArrowBack
            fontSize="small"
            sx={{ color: `${mode ? 'black' : 'rgba(200,200,200)'}` }}
          />
        </button>
        <Typography
          variant="h6"
          sx={{
            color: `${mode ? 'black' : 'rgba(200,200,200)'}`,
            fontFamily: `${Font}`,
            fontSize: `${FontSize}`,
          }}
        >
          Profile settings
        </Typography>
      </div>
      <div
        style={{
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '70%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {fileUpladProgress && (
            <CircularProgress
              size="1.5rem"
              sx={{
                zIndex: '100',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          )}
          <label
            htmlFor="file-upload"
            style={{
              opacity: `${fileUpladProgress ? '.5' : '1'}`,
              zIndex: '0',
            }}
          >
            <Tooltip title="click image to change profile photo">
              <Icon
                sx={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  color: 'white',
                }}
                fontSize="small"
              >
                <Info fontSize="small" />
              </Icon>
            </Tooltip>

            <img
              src={`${props.imageUrl}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          </label>
          <input
            type={'file'}
            style={{
              width: '100%',
              height: '70%',
              display: 'none',
            }}
            accept="image/*"
            id="file-upload"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <Typography
          sx={{
            mt: '1rem',
            color: `${mode ? 'black' : 'rgba(150,150,150)'}`,
            fontFamily: `${Font}`,
            fontSize: `${FontSize}`,
          }}
        >
          User name
        </Typography>
        <TextField
          variant="standard"
          size="small"
          margin="normal"
          sx={{
            mt: '0',
            mb: '.5rem',
          }}
          multiline
          defaultValue={props.userName}
          onChange={(e) => setNewUserName(e.target.value)}
          inputRef={userName}
          error={error}
          InputProps={{
            inputProps: {
              style: {
                textAlign: 'center',
                color: `${mode ? 'black' : 'rgba(255,255,255,.8)'}`,
                fontFamily: `${Font}`,
                fontSize: `${FontSize}`,
              },
            },
          }}
        />

        <Typography
          variant="caption"
          sx={{ color: 'red', opacity: `${error ? '1' : '0'}`, mb: '.5rem' }}
        >
          This user name is allready taken!
        </Typography>

        <Typography
          sx={{
            color: `${mode ? 'black' : 'rgba(150,150,150)'}`,
            fontFamily: `${Font}`,
            fontSize: `${FontSize}`,
          }}
        >
          Bio
        </Typography>
        <TextField
          variant="standard"
          size="small"
          margin="normal"
          sx={{
            mt: '0',
            mb: '1rem',
          }}
          multiline
          defaultValue={props.bio}
          onChange={(e) => setNewBio(e.target.value)}
          inputRef={bio}
          InputProps={{
            inputProps: {
              style: {
                textAlign: 'center',
                color: `${mode ? 'black' : 'rgba(255,255,255,.8)'}`,
                fontFamily: `${Font}`,
                fontSize: `${FontSize}`,
              },
            },
          }}
        />
      </div>
      <Button
        onClick={handleUpdateProfile}
        disabled={error || fileUpladProgress}
        sx={{
          fontFamily: `${Font}`,
          fontSize: `1rem`,
          ':disabled': { color: `${mode ? 'initial' : 'rgba(150,150,150)'}` },
        }}
      >
        Aplly
      </Button>
    </div>
  );
};

export default ContactListMenuOptionsProfile;
