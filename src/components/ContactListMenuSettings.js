import React, { useContext, useState, memo, useEffect, useRef } from 'react';
import {
  CircularProgress,
  Container,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import {
  ArrowBack,
  Camera,
  ColorLens,
  FontDownload,
  SettingsBrightness,
} from '@mui/icons-material';

import { db, storage } from '../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';

import NightModeContext from '../context/NightModeContext';
import { ThemeContext } from '../context/ThemeContext';
import { THEME_COLORS, FONSTS } from '../context/ThemeReducer';
import { AuthContext } from '../context/AuthContext';

const ContactListMenuSettings = (props) => {
  const [fileProgress, setFileProgress] = useState(false);
  const [file, setFile] = useState('');
  const [optionSelected, setOptionSelected] = useState({
    FontContainer: false,
    MBColorContainer: false,
    DarknessContainer: false,
  });

  const nightModeCTX = useContext(NightModeContext);
  const { currentUser } = useContext(AuthContext);
  const { dispach, fontDispach, Font, FontSize } = useContext(ThemeContext);

  const fontContainerRef = useRef();

  const mode = nightModeCTX.context.mode;

  const users = doc(db, 'users', `${currentUser.uid}`);

  const hanldleCloseSettings = () => {
    props.onClose();
    setOptionSelected({ ...{ optionSelected: false } });
  };

  const handlehorizontalScroll = (e) => {
    e.stopPropagation();
    fontContainerRef.current.scrollBy({
      left: e.deltaY < 0 ? -150 : 150,
    });
  };

  useEffect(() => {
    if (file?.name) {
      const storageRef = ref(
        storage,
        `background/${file?.name + Math.trunc(Math.random() * 9999)}.jpg`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      setFileProgress(true);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress === 100) setFileProgress(false);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (downloadURL.trim('').length !== 0) {
              localStorage.setItem('bgUrl', JSON.stringify(downloadURL));
              handleUpdateProfile(downloadURL);
            }
          });
        }
      );
    }
  }, [file]);
  const handleUpdateProfile = async (x) => {
    await updateDoc(users, {
      backgroundImgUrl: x,
    });
  };
  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        backgroundColor: 'transparent',
        left: '0',
        transition: 'all .2s',
        transform: `translateX(${props.open ? '0%' : '100%'})`,
        zIndex: '11',
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
          onClick={hanldleCloseSettings}
        >
          <ArrowBack
            fontSize="small"
            sx={{ color: `${mode ? 'black' : 'rgba(200,200,200)'}` }}
          />
        </button>
        <Typography
          variant="body2"
          sx={{
            color: `${mode ? 'black' : 'rgba(200,200,200)'}`,
            fontFamily: `${Font}`,
            fontSize: `${FontSize}`,
          }}
        >
          Settings
        </Typography>
      </div>

      <label htmlFor="bgImg">
        <ListItemButton
          onClick={(e) => {
            e.stopPropagation();
            setOptionSelected({
              ...{ optionSelected: false },
              bgContainer: true,
            });
          }}
          sx={{
            position: 'relative',
            zIndex: '1',
          }}
          disabled={fileProgress}
        >
          <ListItemIcon>
            <Camera />
          </ListItemIcon>
          <ListItemText sx={{ color: `${mode ? 'black' : 'white'}` }}>
            <Typography sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}>
              background
            </Typography>
          </ListItemText>
          {fileProgress && (
            <CircularProgress size="1.5rem" sx={{ mr: '1rem' }} />
          )}
        </ListItemButton>
      </label>
      <input
        type="file"
        accept="image/*"
        id="bgImg"
        style={{ display: 'none', width: '100%', height: '100%' }}
        disabled={fileProgress}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <ListItemButton
        onClick={() =>
          setOptionSelected({
            ...{ optionSelected: false },
            FontContainer: true,
          })
        }
        sx={{
          position: 'relative',
          transition: 'all .2s',
          pl: `${optionSelected.FontContainer ? '0' : 'auto'}`,
        }}
      >
        <ListItemIcon
          sx={{
            opacity: `${optionSelected.FontContainer ? '0' : '1'}`,
            transition: 'all .25s',
          }}
        >
          <FontDownload sx={{ fontSize: '1.4rem' }} />
        </ListItemIcon>
        <ListItemText
          sx={{
            color: `${mode ? 'black' : 'white'}`,
            opacity: `${optionSelected.FontContainer ? '0' : '1'}`,
            transition: 'all .25s',
          }}
        >
          {' '}
          <Typography sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}>
            Font
          </Typography>
        </ListItemText>
        <Container
          sx={{
            width: '100%',
            backgroundColor: 'transparent',
            zIndex: '2',
            position: 'absolute',
            transform: `translateX(${
              optionSelected.FontContainer ? '0%' : '100%'
            })`,
            transition: 'all .5s',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              overflowX: 'scroll',
              scrollBehavior: 'smooth',
              cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
            ref={fontContainerRef}
            onWheel={(e) => {
              handlehorizontalScroll(e);
            }}
          >
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '1.5rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_1}`,
              }}
              onClick={() => fontDispach({ type: 'FONT_1' })}
            >
              {props.userName}
            </span>
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '1.5rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_2}`,
              }}
              onClick={() => fontDispach({ type: 'FONT_2' })}
            >
              {props.userName}
            </span>
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '.7rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_3}`,
                fontWeight: '100',
              }}
              onClick={() => fontDispach({ type: 'FONT_3' })}
            >
              {props.userName}
            </span>
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '1.5rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_4}`,
              }}
              onClick={() => fontDispach({ type: 'FONT_4' })}
            >
              {props.userName}
            </span>
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_5}`,
              }}
              onClick={() => fontDispach({ type: 'FONT_5' })}
            >
              {props.userName}
            </span>
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '1.5rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_6}`,
              }}
              onClick={() => fontDispach({ type: 'FONT_6' })}
            >
              {props.userName}
            </span>
            <span
              style={{
                width: 'auto',
                height: 'auto',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                fontSize: '1.5rem',
                marginRight: '1.5rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: `${FONSTS.Font_7}`,
              }}
              onClick={() => fontDispach({ type: 'FONT_7' })}
            >
              {props.userName}
            </span>
          </div>
        </Container>
      </ListItemButton>

      <ListItemButton
        onClick={() =>
          setOptionSelected({
            ...{ optionSelected: false },
            MBColorContainer: true,
          })
        }
        sx={{
          position: 'relative',
          transition: 'all .2s',
          pl: `${optionSelected.MBColorContainer ? '0' : 'auto'}`,
        }}
      >
        <ListItemIcon
          sx={{
            opacity: `${optionSelected.MBColorContainer ? '0' : '1'}`,
            transition: 'all .25s',
          }}
        >
          <ColorLens />
        </ListItemIcon>
        <ListItemText
          sx={{
            color: `${mode ? 'black' : 'white'}`,
            opacity: `${optionSelected.MBColorContainer ? '0' : '1'}`,
            transition: 'all .25s',
          }}
        >
          {' '}
          <Typography sx={{ fontFamily: `${Font}`, fontSize: `${FontSize}` }}>
            Message box color
          </Typography>
        </ListItemText>
        <Container
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: '2',
            position: 'absolute',
            transform: `translateX(${
              optionSelected.MBColorContainer ? '0%' : '100%'
            })`,
            transition: 'all .5s',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflowX: 'scroll',
              cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                background: `${THEME_COLORS.mode_1.MBcolor}`,
              }}
              onClick={() => dispach({ type: 'MODE_1' })}
            />
            <span
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                background: `${THEME_COLORS.mode_2.MBcolor}`,
              }}
              onClick={() => dispach({ type: 'MODE_2' })}
            />
            <span
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                background: `${THEME_COLORS.mode_3.MBcolor}`,
              }}
              onClick={() => dispach({ type: 'MODE_3' })}
            />
            <span
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                background: `${THEME_COLORS.mode_4.MBcolor}`,
              }}
              onClick={() => dispach({ type: 'MODE_4' })}
            />
            <span
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                background: `${THEME_COLORS.mode_5.MBcolor}`,
              }}
              onClick={() => dispach({ type: 'MODE_5' })}
            />
            <span
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                background: `${THEME_COLORS.mode_6.MBcolor}`,
              }}
              onClick={() => dispach({ type: 'MODE_6' })}
            />
          </div>
        </Container>
      </ListItemButton>

      <ListItemButton
        onClick={() =>
          setOptionSelected({
            ...{ optionSelected: false },
            DarknessContainer: true,
          })
        }
        sx={{
          position: 'relative',
          transition: 'all .2s',
          pl: `${optionSelected.DarknessContainer ? '0' : 'auto'}`,
        }}
      >
        <ListItemIcon
          sx={{
            opacity: `${optionSelected.DarknessContainer ? '0' : '1'}`,
            transition: 'all .25s',
          }}
        >
          <SettingsBrightness />
        </ListItemIcon>
        <ListItemText
          sx={{
            color: `${mode ? 'black' : 'white'}`,
            opacity: `${optionSelected.DarknessContainer ? '0' : '1'}`,
            transition: 'all .25s',
          }}
        >
          {' '}
          <Typography
            sx={{
              fontFamily: `${Font}`,
              fontSize: `${FontSize}`,
            }}
          >
            Darkness
          </Typography>
        </ListItemText>
        <Container
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: '2',
            position: 'absolute',
            transform: `translateX(${
              optionSelected.DarknessContainer ? '-0%' : '100%'
            })`,
            transition: 'all .5s',
          }}
        ></Container>
      </ListItemButton>
    </div>
  );
};

export default memo(ContactListMenuSettings);
