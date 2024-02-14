import React, { useState, useEffect, useContext, useRef } from 'react';
import MessageBoxContact from './MessageBoxContact';
import MessageBoxUser from './MessageBoxUser';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import './MessagesContainer.css';
import { AuthContext } from '../context/AuthContext';

const MessagesContainer = (props) => {
  const [messagess, setMessagess] = useState([]);
  const [response, setResponse] = useState([]);
  const { currentUser } = useContext(AuthContext);

  let j = useRef();

  const messagesArr = [];
  const timeStampArr = [];
  const messageTable = [];
  const respondMessagesArr = [];
  const respondTimeStampArr = [];
  const respondMessageTable = [];
  const table = [];

  useEffect(() => {
    const r = onSnapshot(doc(db, 'messages', currentUser.uid), (doc) => {
      const { [`${props.contactuid}`]: data } = doc.data();
      setMessagess(data);
    });
  }, [props.contactuid]);

  useEffect(() => {
    if (props.contactuid) {
      setResponse([]);
      const f = onSnapshot(doc(db, 'messages', props.contactuid), (doc) => {
        const { [`${currentUser.uid}`]: data } = doc.data();
        setResponse(data);
      });
    }
  }, [props.contactuid]);

  const allMessages = document.querySelectorAll('.messages');

  useEffect(() => {
    const scroll = () => {
      j.current?.scrollIntoView();
    };
    scroll();
  }, [allMessages]);

  for (let i = 0; i < messagess?.length; i++) {
    if (i % 2 === 0) {
      messagesArr.push(messagess[i]);
    } else {
      timeStampArr.push(messagess[i]);
    }
  }

  for (let i = 0; i < messagess?.length / 2; i++) {
    messageTable.push({
      message: messagesArr[i],
      timeStamp: timeStampArr[i],
      uid: currentUser.uid,
    });
  }

  for (let i = 0; i < response?.length; i++) {
    if (i % 2 === 0) {
      respondMessagesArr.push(response[i]);
    } else {
      respondTimeStampArr.push(response[i]);
    }
  }

  for (let i = 0; i < response?.length / 2; i++) {
    respondMessageTable.push({
      message: respondMessagesArr[i],
      timeStamp: respondTimeStampArr[i],
      uid: props.contactuid,
    });
  }
  table.push(...respondMessageTable, ...messageTable);
  table.sort((a, b) => {
    return a?.timeStamp?.seconds - b?.timeStamp?.seconds;
  });

  const dateConvert = (elem) => {
    return `${new Date(elem?.timeStamp?.toDate())
      .getHours()
      .toString()
      .padStart(2, '0')} : ${new Date(elem?.timeStamp?.toDate())
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div
      className="scrollbar-messages"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        with: '67vw',
        marginTop: '4rem',
        height: '85%',
        backgroundColor: 'transparent',
        overflowY: 'scroll',
        scrollBehavior: 'smooth',
      }}
    >
      {table?.map((elem, id) => {
        if (elem?.uid === currentUser.uid) {
          return (
            <MessageBoxUser
              refs={j}
              key={id}
              message={`${elem.message}`}
              time={`${dateConvert(elem)}`}
            />
          );
        }
        if (elem?.uid === props.contactuid) {
          return (
            <MessageBoxContact
              refs={j}
              key={id}
              message={`${elem.message}`}
              time={`${dateConvert(elem)}`}
              imageUrl={props.imageUrl}
            />
          );
        }
      })}
    </div>
  );
};

export default MessagesContainer;
