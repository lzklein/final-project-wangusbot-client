import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './App';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Header = () => {
  const { token, logout, userData, guilds} = useContext(AuthContext);
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
    console.log({ userData, guilds });
  }

  return (
    <div>
      <Navbar user={userData} login={handleLogin}/>
      {userData ? (
        <div>
          <p>welcome, {userData.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      <button onClick={boop}>boop</button>
    </div>
  );
};

export default Header;
