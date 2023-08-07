import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './App';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Header = () => {
  const { token, logout, userData, guilds, sessionData} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    const loginUrl = 'https://discord.com/api/oauth2/authorize?client_id=1135704138697674752&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Floading&response_type=code&scope=identify%20guilds%20guilds.join%20guilds.members.read'
    window.location.href = loginUrl
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  function boop() {
    console.log({ userData, guilds, sessionData });
  }

  const reset = async () => {
    try {
        const response = await fetch('/reset-database', {
            method: 'POST',
        });

        const data = await response.json();
        alert(data.message); // Show a message to the user
    } catch (error) {
        console.error('Error resetting database:', error);
    }
  };

  const getSession = async () => {
    try {
        const response = await fetch('/getsession', {
            method: 'GET',
        });

        const data = await response.json();
        alert(data); // Show a message to the user
    } catch (error) {
        console.error('Error resetting database:', error);
    }
  };

  return (
    <div>
      <Navbar user={userData} login={handleLogin} logout={logout}/>
      {userData ? (
        <div>
          <p>welcome, {userData.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      <button onClick={boop}>boop</button>
      <button onClick={reset}>Reset</button>
      <button onClick={getSession}>Session</button>
    </div>
  );
};

export default Header;
