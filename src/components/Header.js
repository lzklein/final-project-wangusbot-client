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

  const allCommands = [
    {
      name: 'ping',
      description: 'Pong!',
      type: "slash"
    },
    {
      name:'server',
      description: 'View server details',
      type: "slash"
    },
    {
      name: 'reactionrole',
      description: 'Set server roles with message reactions',
      type: "mod"
    }
  ]

  function postAllCommands() {
    const fetchPromises = allCommands.map(command => {
      return fetch('/commandpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: command.name,
          description: command.description,
          command_type: command.type
        })
      });
    });
  
    Promise.all(fetchPromises)
      .then(responses => {
        const allResponsesSuccessful = responses.every(response => response.ok);
        if (allResponsesSuccessful) {
          alert('Commands posted successfully');
        } else {
          alert('Error posting commands');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while posting commands');
      });
  }
  

  function boop() {
    console.log({ userData, guilds, sessionData });
  }

  const reset = async () => {
    try {
        const response = await fetch('/reset-database', {
            method: 'POST',
        });

        const data = await response.json();
        alert(data.message); 
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
        console.log(data); 
    } catch (error) {
        console.error('Error getting session:', error);
    }
  };

  return (
    <div>
      <Navbar user={userData} login={handleLogin} logout={logout}/>

      {/* {userData ? (
        <div>
          <p>welcome, {userData.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      <p>debug menu</p>
      <button onClick={boop}>boop</button>
      <button onClick={reset}>Reset</button>
      <button onClick={getSession}>Session</button>
      <button onClick={postAllCommands}>Post Commands</button> */}
    </div>
  );
};

export default Header;
