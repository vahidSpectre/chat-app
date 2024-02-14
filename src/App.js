import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import ProfileInfo from './pages/ProfileInfo';

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          index
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route
          index
          path="/profileinfo"
          element={
            <RequireAuth>
              <ProfileInfo />
            </RequireAuth>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
