import React, { useEffect, useState, useContext } from 'react';
import './Home.css';
import Messages from '../components/Messages';
import ContactList from '../components/ContactList';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
const Home = () => {
  const [clickedConUrername, setClickedConUrername] = useState('');
  const [userContactsList, setUserContactsList] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const LiftClickedContact = (selected) => {
    setClickedConUrername(selected);
  };
  useEffect(() => {
    const getUserContacts = async () => {
      const ref = doc(db, 'users', currentUser.uid);
      let u = [];
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        u = docSnap.data().contactsUid;
        setUserContactsList([...u]);
      }
    };
    getUserContacts();
  }, []);

  useEffect(() => {
    const ref = doc(db, 'messages', currentUser.uid);

    var obj = {};
    userContactsList.map((elem) => {
      obj[`${elem}`] = [];
    });
    const handleAdd = async (elem) => {
      await updateDoc(ref, obj);
    };

    handleAdd();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <ContactList clickedcontact={LiftClickedContact} />
      <Messages uid={clickedConUrername} />
    </div>
  );
};

export default Home;
