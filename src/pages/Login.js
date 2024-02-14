import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import Header from '../components/Header';
import { ReactComponent as YourSvg } from '../svg/free_icon_1.svg';

import { updateDoc, doc } from 'firebase/firestore';
import './Login.css';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Email } from '@mui/icons-material';

function Login() {
  const [erorr, setErorr] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setuser] = useState(false);

  const { dispach, currentUser } = useContext(AuthContext);

  const onlineStats = doc(db, 'offlineStats', `${currentUser?.uid}`);

  const formSubmitHandler = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setErorr(false);
        setuser(true);
        dispach({ type: 'LOGIN', payload: user });
        await updateDoc(onlineStats, {
          online: true,
        });
      })
      .catch((error) => {
        setErorr(true);
      });
  };
  return (
    <div style={{ position: 'relative' }}>
      <Header />
      <center>
        <div className="main-container">
          <div className="login-container">
            <center>
              <YourSvg className="svg" />
            </center>
            <h2 className="heading">LOG IN</h2>
            <div className="form-container">
              <form onSubmit={formSubmitHandler} className="form">
                <label className="form-label">Enter your Email</label>
                <input
                  className="form-input"
                  type="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></input>
                <label className="form-label">Enter your password</label>
                <input
                  className="form-input"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></input>
                <button type="submit" className="form-btn">
                  Login
                </button>
                {erorr && (
                  <span className="form-erorr">Invalid Email or password</span>
                )}
              </form>
            </div>
          </div>
          <div className="contact-container">
            <h3 style={{ margin: '1rem' }}>
              This is a simple demo of a chatting app developed with react and
              firebase.
            </h3>
            <h3>Info:</h3>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Email />
              <h5 style={{ margin: '1rem' }}>vahidsayfollahzadeh@gmail.com</h5>
            </span>
          </div>
        </div>
      </center>
      {user && <Navigate to="/" />}
    </div>
  );
}

export default Login;
