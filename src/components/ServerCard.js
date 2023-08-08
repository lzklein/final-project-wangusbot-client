import React, {useState,useEffect, useContext} from 'react'
import discordBlue from '../assets/discord/discordblue.png'
import discordGreen from '../assets/discord/discordgreen.png'
import discordGrey from '../assets/discord/discordgrey.png'
import discordRed from '../assets/discord/discordred.png'
import discordYellow from '../assets/discord/discordyellow.png'
import { AuthContext } from './App';
import {useNavigate, NavLink} from 'react-router-dom';


const ServerCard = ({guild}) => {
  const [botServers, setBotServers]= useState(null);  
  const navigate = useNavigate()
  const { token } = useContext(AuthContext);

  useEffect(()=>{
    fetch('/botservers')
    .then(r => r.json())
    .then(botServerData => {
      // console.log(botServerData);
      setBotServers(botServerData);
      // console.log(botServers)
    })
  },[])

  function guildName(){
    if(guild.name.length > 16){
      return guild.name.slice(0,16) + "..."
    }
    else{
      return guild.name
    }
  }


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


  const handleInvite = () => {
    localStorage.setItem('redirect', guild.name);
    const botServerNames = botServers.map(server => server.discord_name);
    console.log(botServerNames);
    if (botServerNames.includes(guild.name)) {
      navigate(`/server/${guild.name}`);
    } else {
      const botUrl = `https://discord.com/api/oauth2/authorize?client_id=1132873147704676434&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirecting&response_type=code&scope=identify%20bot`;
      window.location.href = botUrl;
    }
  };
  
  
  return (
    <div className='card' onClick={handleInvite}>
      <h4>{guildName()}</h4>
      {guild.icon? 
      <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} alt={"Guild Icon"} draggable="false" width={"150px"} style={{'borderRadius': '5px'}}/>
      :<img src={defaultIcon} alt={"Guild Icon"} draggable="false" width={"150px"} style={{'borderRadius': '5px'}}/>}
    </div>
  )
}

export default ServerCard




  // const handleJoin = async () => {
  //   const botUrl = 'https://discord.com/api/oauth2/authorize?client_id=1132873147704676434&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fserver&response_type=code&scope=identify%20bot'
  //   window.location.href = botUrl
  // }

  // const checkBot = async () => {

  //   try {
  //     console.log(guild.id)
  //     const response = await fetch('/fetch-bot', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         guild_id: guild.id,
  //         user_id: '1132873147704676434',
  //         user_token: token
  //       })
  //     });

  //     if (response.status === 200) {
  //       console.log('bot is here');
  //     } else if (response.status === 404) {
  //       console.log('bot is not here');
  //     }
  //   } catch (error) {
  //     console.error('Error checking bot membership:', error);
  //   }
  // };
