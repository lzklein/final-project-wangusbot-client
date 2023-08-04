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

export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [guilds, setGuilds] = useState(null)

  useEffect(() => {
    // login session check
    const user = localStorage.getItem('userData');
    if (user) {
      try {
        const userConfirmed = JSON.parse(user); 
        setUserData(userConfirmed);
        const guildData = localStorage.getItem('guildData');
        setGuilds(JSON.parse(guildData))
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const login = (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  const logout = () => {
    localStorage.removeItem('userData');    
    localStorage.removeItem('guildData');
    setUserData(null);
    setGuilds(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout , setUserData, userData, guilds, setGuilds}}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/commands" element={<CommandList />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
