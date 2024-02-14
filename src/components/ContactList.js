import {
  AppBar,
  Fab,
  Input,
  InputAdornment,
  Menu,
  Toolbar,
} from '@mui/material';
import React, { useEffect, useState, useContext, useRef } from 'react';
import ContactBox from '../components/ContactBox';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { ArrowBackIos, ArrowForwardIos, Search } from '@mui/icons-material';
import './ContactList.css';
import './ContactListMenu.css';
import glass from '../Pics/glass.jpg';
import ContactListMenu from './ContactListMenu';
import NightModeContext from '../context/NightModeContext';

const ContactList = (props) => {
  const [userNamesList, setUserNamesList] = useState([]);
  const [searchedUsername, setSearchedUsername] = useState('');
  const [foundUsersUid, setFoundUsersUid] = useState('');
  const [userContactsList, setUserContactsList] = useState([]);
  const [noContacts, setNoContacts] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [ClickedConUsername, setClickedConUsername] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [ContactOrderedList, setContactOrderedList] = useState([]);
  const [order, setOrder] = useState(true);
  const [bio, setBio] = useState('');
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isContactListClose, setIsContactListClose] = useState(false);

  const input = useRef();

  const NightModeCTX = useContext(NightModeContext);
  const { currentUser } = useContext(AuthContext);

  const open = Boolean(anchorEl);
  const documentCollectionRef = collection(db, 'users');
  const onlineStats = doc(db, 'offlineStats', `${currentUser.uid}`);

  const mode = NightModeCTX.context.mode;

  useEffect(() => {
    const getUserContacts = async () => {
      const r = onSnapshot(doc(db, 'messages', currentUser.uid), (doc) => {
        if (doc.exists()) {
          let u = [];
          u = Object.keys(doc.data());
          setUserContactsList([...u]);
          setNoContacts(false);
        } else {
          setNoContacts(true);
        }
      });
      const f = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          setBio(docSnap.data().bio);
          setUserName(docSnap.data().username);
          setImageUrl(docSnap.data().imgUrl);
        }
      });
    };
    getUserContacts();
  }, []);
  // -------------SETTING TIMEOUT TO MAKE SURE CONTACT LIST ARR FILLED
  if (order) {
    setTimeout(() => {
      g(userContactsList);
      setTimeout(() => {
        setOrder(false);
      }, 5000);
    }, 100);
  }
  useEffect(() => {
    setFoundUsersUid('');
    const searchUsers = async (e) => {
      const allUserNames = [];
      const data = await getDocs(documentCollectionRef);
      setUserNamesList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      userNamesList.forEach((element) => {
        allUserNames.push([element.username, element.uid]);
      });
      for (let i = 0; i <= allUserNames.length; i++) {
        if (searchedUsername === allUserNames[i][0]) {
          if (allUserNames[i][1] === currentUser.uid) {
            break;
          } else {
            setFoundUsersUid(allUserNames[i][1]);
          }
          break;
        }
      }
    };
    searchUsers();
  }, [searchedUsername]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSidebarModal = (e) => {
    if (isInputFocused) {
      setIsInputFocused(false);
      setFoundUsersUid(false);
      input.current.value = '';
    }
    if (!isInputFocused) {
      setAnchorEl(e.currentTarget);
    }
    if (anchorEl) {
      setAnchorEl(null);
    }
  };
  props.clickedcontact(ClickedConUsername);
  const deletOfflineCounter = async (x) => {
    await updateDoc(onlineStats, {
      [x]: 0,
    });
  };

  const [messagess, setMessagess] = useState([]);
  const [response, setResponse] = useState([]);

  const g = (x) => {
    let u = {};
    let v = [];
    let u2 = {};
    let v2 = [];

    x.forEach((elem) => {
      const r = onSnapshot(doc(db, 'messages', currentUser?.uid), (doc) => {
        const { [elem]: data } = doc.data();
        u = { time: data.at(-1), uid: elem };
        v.push(u);
        setMessagess(v);
      });
      const f = onSnapshot(doc(db, 'messages', elem), (doc) => {
        const { [`${currentUser.uid}`]: data2 } = doc.data();
        u2 = { time: data2.at(-1), uid: elem };
        v2.push(u2);
        setResponse(v2);
      });
    });
    contactListOrder(response, messagess);
  };
  const contactListOrder = (arr, brr) => {
    let crr = [];
    let q = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.uid === brr[i]?.uid) {
        if (arr[i].time > brr[i].time && arr[i] !== NaN) {
          crr.push({ uid: arr[i].uid, time: arr[i].time });
        } else {
          crr.push({ uid: arr[i].uid, time: brr[i].time });
        }
      }
    }
    function compare(a, b) {
      if (a.time < b.time) {
        return 1;
      }
      if (a.time > b.time) {
        return -1;
      }
      return 0;
    }
    crr.sort(compare);
    for (let i = 0; i < crr.length; i++) {
      q.push(crr[i].uid);
      setContactOrderedList(q);
    }
  };

  useEffect(() => {
    setOrder(true);
  }, [userContactsList]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        maxWidth: '33vw',
        width: `${isContactListClose ? '0%' : '100%'}`,
        position: 'relative',
        transition: 'all .5s',
      }}
    >
      <button
        className="close-contacts-btn"
        style={{
          backgroundColor: `${mode ? 'white' : 'rgba(0,0,0,.5)'}`,
        }}
        onClick={() => setIsContactListClose(isContactListClose ? false : true)}
      >
        {isContactListClose ? (
          <ArrowForwardIos
            fontSize="1rem"
            sx={{ color: `${mode ? 'black' : 'white'}` }}
          />
        ) : (
          <ArrowBackIos
            fontSize="1rem"
            sx={{ color: `${mode ? 'black' : 'white'}` }}
          />
        )}
      </button>
      <AppBar
        position="absolute"
        sx={{
          height: '4rem',
          width: '100%',
          left: '0',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'end',
          backgroundColor: `${mode ? 'white' : 'rgb(43, 43, 43)'}`,
          transition: 'all .2s ease',
          backgroundImage: `${mode ? 'none' : `url(${glass})`}`,
          backgroundSize: '50%',
          filter: `${mode ? 'none' : 'brightness(90%)'}`,
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            p: '0 !important',
          }}
        >
          <Fab
            className={`fab ${isInputFocused ? 'fab-transformed' : ''}`}
            size="small"
            sx={{
              minWidth: '0',
              minHeight: '0',
              boxShadow: 'none',
              ml: '15px',
              flexDirection: 'column',
              backgroundColor: `${mode ? 'rgb(235, 235, 235)' : 'white'}`,
              transition: 'all .5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleSidebarModal}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className={`HambergerBtn line1 ${
                  isInputFocused ? 'line1-transformed' : ''
                }`}
              ></div>
              <div className={`HambergerBtn line2`}></div>
              <div
                className={`HambergerBtn line3 ${
                  isInputFocused ? 'line3-transformed' : ''
                }`}
              ></div>
            </div>
          </Fab>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              className: 'sidebar-box',
            }}
          >
            <ContactListMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              bio={bio}
              userName={userName}
              imageUrl={imageUrl}
            />
          </Menu>

          <Input
            inputRef={input}
            size="medium"
            disableUnderline={true}
            onChange={(e) => {
              isInputFocused
                ? setSearchedUsername(e.target.value)
                : setSearchedUsername('');
            }}
            sx={{
              borderRadius: '50px',
              marginLeft: '25px',
              marginRight: '15px',

              height: '60%',
              width: '60%',
              border: '1.5px solid transparent',
              transition: 'all .2s ease-in',
              backgroundColor: `${mode ? 'rgb(235, 235, 235)' : 'white'}`,
              display: `${isContactListClose ? 'none' : 'flex'}`,
            }}
            onClick={(e) => setIsInputFocused(true)}
            style={{
              borderColor: isInputFocused ? 'rgb(0, 119, 255)' : 'transparent',
              backgroundColor: isInputFocused ? 'white' : 'rgb(235, 235, 235)',
            }}
            startAdornment={
              <InputAdornment
                style={{
                  color: isInputFocused ? 'rgb(0, 119, 255)' : 'gray',
                }}
                sx={{
                  marginLeft: '10px',
                  transition: 'all .2s ease-out',
                }}
                position="start"
              >
                <Search fontSize="large" sx={{ width: '90%' }} />
              </InputAdornment>
            }
          />
        </Toolbar>
      </AppBar>

      <div
        className="scrollbar glass"
        style={{
          width: '33vw',
          height: 'calc(100vh - 4rem)',
          overflowY: 'scroll',
          position: 'relative',
          alignSelf: 'end',
          transition: 'all 0.2s ease',
          backgroundImage: `${mode ? 'none' : `url(${glass})`}`,
          backgroundSize: '100%',
          filter: `${mode ? 'none' : 'brightness(90%)'}`,
        }}
      >
        {foundUsersUid && searchedUsername !== '' ? (
          <div>
            <center>
              <ContactBox
                onClick={() => {
                  setClickedConUsername(foundUsersUid);
                }}
                uid={foundUsersUid}
              />
            </center>
          </div>
        ) : (
          <center>
            {noContacts ? (
              <div></div>
            ) : (
              ContactOrderedList.map((elem) => {
                return (
                  <ContactBox
                    key={elem}
                    uid={elem}
                    onClick={() => {
                      setClickedConUsername(elem);
                      deletOfflineCounter(elem);
                    }}
                  />
                );
              })
            )}
          </center>
        )}
      </div>
    </div>
  );
};

export default ContactList;
