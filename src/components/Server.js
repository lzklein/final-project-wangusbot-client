import React, {useState, useEffect,useContext} from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from './App';


const Server = () => {
  const { guilds } = useContext(AuthContext);
  const { serverName } = useParams();

  // serverDetails if server stats are ever needed
  const [serverDetails, setServerDetails] = useState(null);
  const [allCommands, setAllCommands] = useState([]);
  const [serverCommands, setServerCommands] = useState([]);
  const [selectedCommands, setSelectedCommands] = useState([]);
  const [guildsFetched, setGuildsFetched] = useState(false);

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
  
  
  

  const handleCheckboxChange = (e, description, id) => {
    const checkboxValue = e.target.value;
    if (e.target.checked) {
      setSelectedCommands([...selectedCommands, { id: id, name: checkboxValue, description }]);
    } else {
      setSelectedCommands(selectedCommands.filter(item => item.name !== checkboxValue));
    }
  };
  
  const renderForm = () => {
    return allCommands.map(command => {
      const isChecked = serverCommands.includes(command.name) || selectedCommands.some(item => item.name === command.name);
      return (
        <div key={command.id}>
          <input 
            type="checkbox" 
            id={command.id} 
            name={command.name} 
            value={command.name} 
            onChange={(e) => handleCheckboxChange(e, command.description, command.id)} 
            checked={isChecked}
          />
          <label htmlFor={command.id}> {command.name}: {command.description}</label>
          <br/>
        </div>
      );
    });
  }
  
  const renderServerCommands = () => {
    // console.log(serverCommands);
    if(serverCommands.length == 0){
      return(
        <h4 style={{marginTop: '40px'}} >No Commands Enabled</h4>
      )
    }
    else{
      return serverCommands.map(command => {
        return(
            <h4 style={{marginTop: '40px'}} key={command.id}>{command.command_name}: {command.command_description}</h4>
        );
      })
    }
  }

  const checkCheckbox=()=>{
    console.log({selectedCommands: selectedCommands, serverDetails: serverDetails, serverCommands: serverCommands})
  }
  if (!guildsFetched || !serverDetails) {
    return <p>Loading...</p>; // You can replace this with a loading spinner or message
  }
  return (
    <div>
      {/* <button onClick={checkCheckbox}>bip</button> */}
      <h1>Server Details: {serverName}</h1>
      <img src={`https://cdn.discordapp.com/icons/${serverDetails.id}/${serverDetails.icon}`} width={"15%"} />
      <div className="server-commands">
        <h3>{serverName}'s Commands:</h3>
        {renderServerCommands()}
      </div>
      <div className="server-commands">
        <h3>Available Commands:</h3>
        <form onSubmit={updateCommands}>
          {renderForm()}
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Server