import '../App.css';
import React, {useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from "./Header";
import Home from "./Home";
import CommandList from "./CommandList";
import Dashboard from "./Dashboard";
import Server from "./Server";
import BotStatus from "./BotStatus";

function App() {
  
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/commands" element={<CommandList />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/server" element={<Server />}/>
        <Route path="/status" element={<BotStatus />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
    </div>
  );
}

export default App;
