import '../App.css';
import React, {createContext, useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from "./Header";
import Home from "./Home";
import CommandList from "./CommandList";
import Dashboard from "./Dashboard";
import Server from "./Server";
import BotStatus from "./BotStatus";
import Loading from "./Loading";
import ServerRedirect from "./ServerRedirect"
import ReactionRoles from "./ReactionRole"

export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [guilds, setGuilds] = useState(null)
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Fetch the user's session data from the server
    // !localStorage method
    const userDataJSON = localStorage.getItem('userData');
    const user = JSON.parse(userDataJSON);
    const guildDataJSON = localStorage.getItem('guildData');
    const guildData = JSON.parse(guildDataJSON);
    const sessionDataJSON = localStorage.getItem('sessionData');
    const session = JSON.parse(sessionDataJSON);
    if (user) {
      setUserData(user)
      setGuilds(guildData)
      setSessionData(session)
    }
    // ! flask session method session needs fixing
    // fetch("/checksession")
    //     .then((response) => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             throw new Error('Session check failed');
    //         }
    //     })
    //     .then((user) => {
    //         setUserData(user);
    //         // Fetch additional user data, like guilds, if needed
    //         // For example:
    //         // fetchUserGuilds(user.id);
    //     })
    //     .catch((error) => {
    //         console.error('Error checking session:', error);
    //     });
}, []);

  // const login = (user) => {
  //   localStorage.setItem('userData', JSON.stringify(user));
  //   function handleLogin(e) {
  //     e.preventDefault();

  //     fetch('/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         username: username,
  //         password: password,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (!data.message) {
  //           // Login successful, set user state and navigate to home
  //           onLogin(data);
  //           navigate('/');
  //         } else {
  //           // Login failed, display error message (optional)
  //           console.log('Login failed:', data.message);
  //           alert('Login failed');
  //         }
  //       })
  //       .catch((error) => {
  //         // Handle fetch or other errors (optional)
  //         console.error('Error during login:', error);
  //       });
  //   }
  // }

  const logout = () => {
    // setUserData(null);
    // setSessionData(null)
    // setGuilds(null);
    // setToken(null);
    // !localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('guildData');
    localStorage.removeItem('sessionData');
    // !flask-session
    fetch(`http://127.0.0.1:5555/logout/${userData.id}`, {
        method: 'DELETE'
    })
    .then((response) => {
        if (response.status === 204) {
            // Logout was successful
            setUserData(null);
            setSessionData(null)
            setGuilds(null);
            setToken(null);
            window.location.href = '/'; // Redirect to the desired URL after logout
        } else {
            console.error('Logout failed:', response);
        }
    })
    .catch((error) => {
        console.error('Error logging out:', error);
    });
};


  return (
    <AuthContext.Provider value={{ token, setToken, logout , setUserData, userData, guilds, setGuilds, sessionData, setSessionData}}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/commands" element={<CommandList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/server/:serverName/reactionrole" element={<ReactionRoles />}/>
          <Route path="/server/:serverName" element={<Server />} />
          <Route path="/status" element={<BotStatus />} />
          <Route path="/loading" element={<Loading />}/>
          <Route path="/redirecting" element={<ServerRedirect />}/>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
