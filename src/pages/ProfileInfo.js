import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Input,
  Typography,
} from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { AccountCircle } from '@mui/icons-material';

function ProfileInfo() {
  const [file, setFile] = useState('');
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [reallName, setReallName] = useState('');
  const [country, setcountry] = useState('');
  const [userData, setuserData] = useState([]);
  const [userNameError, setUserNameError] = useState(true);
  const [reqUserName, setReqUserName] = useState(true);
  const [success, setSuccess] = useState(false);
  const [profileImageUrl, setprofileImageUrl] = useState('');
  const [imgUplodRunning, setImgUplodRunning] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const documentCollectionRef = collection(db, 'users');
  const handleUsernameValidation = async (e) => {
    const allUserNames = [];
    const data = await getDocs(documentCollectionRef);
    setuserData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    const tempUserName = e.target.value;
    userData.forEach((element) => {
      allUserNames.push(element.username);
    });
    setTimeout(() => {
      for (let i = 0; i <= allUserNames.length; i++) {
        if (tempUserName === allUserNames[i]) {
          setUserNameError(true);
          setReqUserName(true);
          break;
        }
        setUserName(tempUserName);
        setUserNameError(false);
        setReqUserName(false);
      }
    }, 100);
  };
  useEffect(() => {
    const storageRef = ref(
      storage,
      `profileImages/${file.name + Math.trunc(Math.random() * 9999)}.jpg`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case 'running':
            if (progress !== NaN && file !== '') {
              setImgUplodRunning(true);
            }
            break;
        }
      },
      (error) => {
        throw error;
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setprofileImageUrl(downloadURL);
        });
      }
    );
  }, [file]);

  const handleProfileInfo = async (e) => {
    e.preventDefault();

    await setDoc(doc(db, 'users', currentUser.uid), {
      name: reallName,
      country: country,
      username: userName,
      bio: bio,
      imgUrl: profileImageUrl,
      contactsUid: [''],
      uid: currentUser.uid,
    });
    await setDoc(doc(db, 'messages', currentUser.uid), {});
    await setDoc(doc(db, 'lastMessage', currentUser.uid), {});
    await setDoc(doc(db, 'offlineStats', currentUser.uid), { online: true });
    profileImageUrl === '' ? setSuccess(false) : setSuccess(true);
  };
  return (
    <form
      onSubmit={handleProfileInfo}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(36deg, rgba(201,151,0,1) 0%, rgba(244,244,18,1) 35%, rgba(0,212,255,1) 100%)',
      }}
    >
      <Card
        sx={{
          width: '60%',
          height: '70%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <label htmlFor="file">
          <Avatar
            sx={{
              width: '150px',
              height: '150px',
              margin: '70px',
              cursor: 'pointer',
            }}
            src={profileImageUrl}
          >
            {imgUplodRunning ? (
              <CircularProgress />
            ) : (
              <AccountCircle sx={{ width: '100%', height: '100%' }} />
            )}
          </Avatar>
        </label>
        <input
          type="file"
          id="file"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Input
            type="text"
            id="reallname"
            onChange={(e) => setReallName(e.target.value)}
            placeholder="reall name"
            sx={{ mt: '5%' }}
          ></Input>
          <Input
            type="text"
            id="username"
            onChange={handleUsernameValidation}
            placeholder="username"
            sx={{ mt: '10%' }}
            required
          ></Input>
          {userNameError ? (
            <Typography
              color={'red'}
              fontSize={'.7rem'}
              width={'150px'}
              alignSelf={'center'}
              textAlign={'center'}
            >
              This user name is taken!
            </Typography>
          ) : (
            <Typography
              color={'green'}
              fontSize={'.7rem'}
              width={'150px'}
              alignSelf={'center'}
              textAlign={'center'}
            >
              user name is valid!
            </Typography>
          )}
          <Input
            type="text"
            id="bio"
            onChange={(e) => setBio(e.target.value)}
            placeholder="bio"
            sx={{ mt: '5%' }}
            required
          ></Input>

          <Input
            type="text"
            id="country"
            onChange={(e) => setcountry(e.target.value)}
            placeholder="country"
            sx={{ mt: '10%' }}
          ></Input>
          <Button
            sx={{
              mt: '10%',
              alignSelf: 'center',
            }}
            type="submit"
            variant="outlined"
            color="success"
            disabled={reqUserName || bio === '' || reallName === ''}
          >
            Submit
          </Button>
        </div>
      </Card>
      {success && <Navigate to="/" />}
    </form>
  );
}

export default ProfileInfo;
