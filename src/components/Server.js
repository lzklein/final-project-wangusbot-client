import React, {useState, useEffect,useContext} from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from './App';


const Server = () => {
  const { guilds } = useContext(AuthContext);
  const { serverName } = useParams();
  const decodedServerName = decodeURIComponent(serverName);
  const [serverDetails, setServerDetails] = useState(null)

  useEffect(()=>{
    const server = guilds.find(guild => guild.name === decodedServerName);
    setServerDetails(server);
    localStorage.removeItem('redirect');
  },[])

  return (
    <div>
      <h1>Server Details: {serverName}</h1>
      <h3>Available Commands:</h3>
    </div>  )
}

export default Server