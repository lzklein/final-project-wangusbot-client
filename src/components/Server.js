import React, {useState, useEffect,useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './App';
import discordBlue from '../assets/discord/discordblue.png'
import discordGreen from '../assets/discord/discordgreen.png'
import discordGrey from '../assets/discord/discordgrey.png'
import discordRed from '../assets/discord/discordred.png'
import discordYellow from '../assets/discord/discordyellow.png'


const Server = () => {
  const { guilds } = useContext(AuthContext);
  const { serverName } = useParams();
  // serverDetails if server stats are ever needed
  const [serverDetails, setServerDetails] = useState(null);
  const [allCommands, setAllCommands] = useState([]);
  const [serverCommands, setServerCommands] = useState([]);
  const [selectedCommands, setSelectedCommands] = useState([]);
  const [guildsFetched, setGuildsFetched] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (guilds) {
      // If guilds data is available, set the loading state to true
      setGuildsFetched(true);
    }
  }, [guilds]);

  useEffect(()=>{
    if(guildsFetched){
      const decodedServerName = decodeURIComponent(serverName);
      const server = guilds.find(guild => guild.name === decodedServerName);
      setServerDetails(server);
      localStorage.removeItem('redirect');
      fetch('/commandlist')
      .then(r => r.json())
      .then(commandData => {
        setAllCommands(commandData);
        console.log(commandData);
      })
      fetch('/commandcheck')
      .then(r=>r.json())
      .then(commandListData => {
        setServerCommands(commandListData);
        // setSelectedCommands(commandListData);
        console.log(commandListData);
      })
    }
  },[guildsFetched])

  const randomDefaultIcon = () => {
    const random = Math.floor(Math.random() * 5) + 1;
    switch (random) {
      case 1: return discordBlue;
      case 2: return discordGreen;
      case 3: return discordGrey;
      case 4: return discordRed;
      case 5: return discordYellow;
    }
  };

  const defaultIcon = randomDefaultIcon();
  
  const updateCommands = async (e) => {
    e.preventDefault();
  
    const commandsToAdd = selectedCommands.filter(
      (command) => !serverCommands.some((item) => item.command_name === command.name)
    );
    const commandsToDelete = serverCommands.filter(
      (command) => !selectedCommands.some((item) => item.name === command.command_name)
    );
  
    const addPromises = commandsToAdd.map(async (command) => {
      try {
        const response = await fetch('/addservercommand', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            command_id: command.id,
            name: command.name,
            description: command.description,
            discord_id: serverDetails.id,
            discord_name: serverDetails.name,
            command_type: command.command_type
          }),
        });
  
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.error(`Error adding command ${command.name}:`, error);
      }
    });
  
    const deletePromises = commandsToDelete.map(async (command) => {
      try {
        const response = await fetch(`/deleteservercommand/${command.id}`, {
          method: 'DELETE',
        });
  
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.error(`Error deleting command ${command.command_name}:`, error);
      }
    });
  
    await Promise.all([...addPromises, ...deletePromises]);
  
    // Update server commands after adding and deleting
    try {
      const updatedServerCommandsResp = await fetch('/commandcheck');
      const updatedServerCommands = await updatedServerCommandsResp.json();
      setServerCommands(updatedServerCommands);
    } catch (error) {
      console.error('Error fetching updated server commands:', error);
    }
  };

  const handleCheckboxChange = (e, description, id,command_type) => {
    const checkboxValue = e.target.value;
    if (e.target.checked) {
      setSelectedCommands([...selectedCommands, { id: id, name: checkboxValue, description, command_type }]);
    } else {
      setSelectedCommands(selectedCommands.filter(item => item.name !== checkboxValue));
    }
  };
  
  const renderForm = () => {
    return allCommands.map(command => {
      console.log(command)
      console.log(command.command_type)
      const isChecked = serverCommands.includes(command.name) || selectedCommands.some(item => item.name === command.name);
      return (
        <div key={command.id} style={{marginBottom: "5px"}} className="checkbox-form">
          <input 
            type="checkbox" 
            id={command.id} 
            name={command.name} 
            value={command.name} 
            onChange={(e) => handleCheckboxChange(e, command.description, command.id, command.command_type)} 
            checked={isChecked}
          />
          <label htmlFor={command.id} className="control control--checkbox"> {command.name}: {command.description}</label>
          <br/>
        </div>
      );
    });
  }
  
  const renderServerCommands = () => {
    // console.log(serverCommands);
    const filteredCommands = serverCommands.filter(command => command.discord_id == serverDetails.id)
    if(filteredCommands.length == 0){
      return(
        <h4 style={{marginTop: '40px'}} >No Commands Enabled</h4>
      )
    }
    else{
      return filteredCommands.map(command => {
        if(command.command_type == "mod"){
          return(
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <h4 key={command.id} style={{ marginRight: '10px' }}>
                {command.command_name}: {command.command_description}
              </h4>
              <button onClick={()=> {navigate(`/server/${serverName}/${command.command_name}`)}}>Edit</button>
            </div>
          )
        }
        else{
          return(
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <h4 key={command.id}>{command.command_name}: {command.command_description}</h4>
            </div>
        );
        }
      })
    }
  }

  const checkCheckbox=()=>{
    console.log({selectedCommands: selectedCommands, serverDetails: serverDetails, serverCommands: serverCommands, allCommands: allCommands})
  }
  if (!guildsFetched || !serverDetails) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <button onClick={checkCheckbox}>bip</button>
      <h1>Server Details: {serverName}</h1>
      {serverDetails.icon?
        <img src={`https://cdn.discordapp.com/icons/${serverDetails.id}/${serverDetails.icon}`} width={"15%"} />
      : <img src={defaultIcon} width={"15%"} />
      }
      <div className="server-commands">
        <h3 style={{marginBottom:"15px"}}>{serverName}'s Commands:</h3>
        {renderServerCommands()}
      </div>
      <div className="server-commands">
        <h3>Available Commands:</h3>
        <form onSubmit={updateCommands} >
          {renderForm()}
          <button type='submit' className="checkbox-button">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Server