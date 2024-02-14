import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAe2V19peiMV7wvDI4hOIsZhI5rjf6vITY',
  authDomain: 'some-dummy-project-31d8a.firebaseapp.com',
  projectId: 'some-dummy-project-31d8a',
  storageBucket: 'some-dummy-project-31d8a.appspot.com',
  messagingSenderId: '739788085837',
  appId: '1:739788085837:web:d116938999db29d87b1a04',
  measurementId: 'G-RT12K9S9K2',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
