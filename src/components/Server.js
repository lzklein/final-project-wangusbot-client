import React, {useState, useEffect,useContext} from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from './App';


const Server = () => {
  const { guilds } = useContext(AuthContext);
  const { serverName } = useParams();
  const decodedServerName = decodeURIComponent(serverName);
  const [serverDetails, setServerDetails] = useState(null);
  const [allCommands, setAllCommands] = useState([]);
  useEffect(()=>{
    const server = guilds.find(guild => guild.name === decodedServerName);
    setServerDetails(server);
    localStorage.removeItem('redirect');
    fetch('/botcheck')
    .then(r => r.json())
    .then(commandData => {
      setAllCommands(commandData);
      console.log(commandData);
    })
  },[])
  // create list of all commands in checkbox form
  // on submit, post submitted commands to ServerCommands
  // ! maybe useEffect ServerCommands, and existing ones start checked?
  // then can uncheck already checked ones to delete them from ServerCommands
  return (
    <div>
      <h1>Server Details: {serverName}</h1>
      <h3>Available Commands:</h3>
    </div>  )
}

export default Server