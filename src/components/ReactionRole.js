import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";


const ReactionRoles = () => {
  const navigate = useNavigate();

  const [leftColumnEntries, setLeftColumnEntries] = useState([
    { id: 1, message: 'Reaction Message 1' }, // Initial entry with an ID
  ]);

  const [rightColumnEntries, setRightColumnEntries] = useState([
    { id: 1, emote: '', role: '' }, // Initial entry with an ID
  ]);

  const handleAddMessage = () => {
    const newId = leftColumnEntries.length + 1;
    setLeftColumnEntries([...leftColumnEntries, { id: newId, message: `Reaction Message ${newId}` }]);
  };

  const handleRemoveMessage = (id) => {
    const updatedEntries = leftColumnEntries.filter(entry => entry.id !== id);
    setLeftColumnEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    const newId = rightColumnEntries.length + 1;
    setRightColumnEntries([...rightColumnEntries, { id: newId, emote: '', role: '' }]);
  };

  const handleRemoveEntry = (id) => {
    const updatedEntries = rightColumnEntries.filter(entry => entry.id !== id);
    setRightColumnEntries(updatedEntries);
  };

  const handleEmoteChange = (index, emote) => {
    const updatedEntries = [...rightColumnEntries];
    updatedEntries[index].emote = emote;
    setRightColumnEntries(updatedEntries);
  };

  const handleRoleChange = (index, role) => {
    const updatedEntries = [...rightColumnEntries];
    updatedEntries[index].role = role;
    setRightColumnEntries(updatedEntries);
  };

  return (
    <div className="commands">
      <div className="column-short" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button style={{ alignSelf: "flex-start", marginBottom: "5px" }} onClick={()=>{navigate(-1)}}>{"<< "}Back to Server</button>
        <ul className="message-list">
          <li className="column-heading" style={{textAlign:"center"}}>Your Messages</li>
          {leftColumnEntries.map((entry, index) => (
            <li key={entry.id} className="column-item" >
              {entry.message}
              <button type="button" onClick={() => handleRemoveMessage(entry.id)} style={{marginLeft:"15px"}}>X</button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleAddMessage} style={{marginBottom:"15px"}}>+ ADD A MESSAGE</button>
      </div>
      <div className="column-long">
        <h2>*Currently selected message* (page wip)</h2>
        <form className="reaction-roles-form">
          <h4>Write your Reaction Role Message:</h4>
          <textarea className="rr-message" />
          <h4>Add your Reaction Roles:</h4>
          {rightColumnEntries.map((entry, index) => (
            <div key={entry.id} className="role-entry">
              <select
                value={entry.emote}
                onChange={(e) => handleEmoteChange(index, e.target.value)}
              >
                <option value="">Select an Emote</option>
                <option>🏈</option>
                <option>⚽️</option>
                <option>🏀</option>
              </select>
              <select
                value={entry.role}
                onChange={(e) => handleRoleChange(index, e.target.value)}
              >
                <option value="">Select a Role</option>
                <option>ServerRole1</option>
                <option>ServerRole2</option>
                <option>ServerRole3</option>
              </select>
              <button type="button" onClick={() => handleRemoveEntry(entry.id)}>-</button>
            </div>
          ))}
          <button type="button" onClick={handleAddEntry}>+</button>
          <div className="button-container" style={{padding:"15px 0px"}}>
            <button type="submit" className="checkbox-button" style={{margin:"10px"}}>Save</button>
            <button type="submit" className="checkbox-button" style={{margin:"10px"}}>Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReactionRoles;
