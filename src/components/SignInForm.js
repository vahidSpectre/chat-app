import React, { useState, useContext } from 'react';
import { Button, Typography, TextField } from '@mui/material';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import './SignInForm.css';
import { AuthContext } from '../context/AuthContext';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(0);
  const [tempPass, setTempPass] = useState('');
  const [disableRepeatPass, setdisableRepeatPass] = useState(true);
  const [userSignedInSucess, setuserSignedInSucess] = useState(false);
  const { dispach } = useContext(AuthContext);
  const strPassFn = (e) => {
    const testPass = e.target.value;
    if (testPass.trim().length >= 8) {
      setTempPass(testPass);
      setIsPasswordStrong(3);
      setdisableRepeatPass(false);
    } else if (testPass.trim().length >= 4) {
      setTempPass(testPass);
      setIsPasswordStrong(2);
      setdisableRepeatPass(false);
    } else {
      setIsPasswordStrong(1);
      setdisableRepeatPass(true);
    }
  };
  const textFn = (e) => {
    if (e === 3) {
      return (
        <Typography color="green" variant="h6" fontSize=".7rem" mt="2px">
          Password is Strong!
        </Typography>
      );
    } else if (e === 2) {
      return (
        <Typography
          color="rgb(219, 219, 59)"
          variant="h6"
          fontSize=".7rem"
          mt="2px"
        >
          Password is normal!
        </Typography>
      );
    } else if (e === 1) {
      return (
        <Typography color="red" variant="h6" fontSize=".7rem" mt="2px">
          Password is weak!
        </Typography>
      );
    }
  };
  const matchPassFn = (e) => {
    const testRePass = e.target.value;
    if (testRePass === tempPass) {
      setPassword(e.target.value);
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };
  const HandleSignin = async (e) => {
    e.preventDefault();

    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((userCredential) => {
      const user = userCredential.user;
      setuserSignedInSucess(true);
      dispach({ type: 'LOGIN', payload: user });
      return user;
    });
  };

  return (
    <form onSubmit={HandleSignin} className="signin-form">
      <TextField
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mt: '25px' }}
        size="small"
      ></TextField>
      <TextField
        label="password"
        onChange={strPassFn}
        sx={{
          mt: '20px',
        }}
        size="small"
        type={password}
      ></TextField>
      {textFn(isPasswordStrong)}
      <TextField
        label="repeat password"
        onChange={matchPassFn}
        sx={{
          mt: '5px',
        }}
        size="small"
        disabled={disableRepeatPass}
      ></TextField>
      {isPasswordValid ? (
        <Typography color="green" variant="h6" fontSize=".7rem" mt="2px">
          Password validated!
        </Typography>
      ) : (
        <Typography color="red" variant="h6" fontSize=".7rem" mt="2px">
          Passwords do not match
        </Typography>
      )}
      <Button
        type="submit"
        className="signin-form-button"
        variant="contained"
        color="success"
        sx={{ mt: '20px' }}
      >
        Sign In
      </Button>
      {userSignedInSucess && <Navigate to="/profileinfo" />}
    </form>
  );
}

export default SignInForm;
