import React, {useContext} from 'react'
import discordBlue from '../assets/discord/discordblue.png'
import discordGreen from '../assets/discord/discordgreen.png'
import discordGrey from '../assets/discord/discordgrey.png'
import discordRed from '../assets/discord/discordred.png'
import discordYellow from '../assets/discord/discordyellow.png'
import { AuthContext } from './App';


const ServerCard = ({guild}) => {
  const { token } = useContext(AuthContext);
  function guildName(){
    if(guild.name.length > 16){
      return guild.name.slice(0,16) + "..."
    }
    else{
      return guild.name
    }
  }

  const handleJoin = async () => {
    const botUrl = 'https://discord.com/api/oauth2/authorize?client_id=1132873147704676434&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fserver&response_type=code&scope=identify%20bot'
    window.location.href = botUrl
  }

  const checkBot = async () => {
    const guildId = guild.id;
    // console.log(botToken)

    const userId = 'YOUR_BOT_ID';
    const token = 'MTEzMjg3MzE0NzcwNDY3NjQzNA.GoNUsU.D5Dr1U6F_oHLio0V7Xm1obFRMQNL22nySTpNSM';

    try {
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
        headers: {
          'Authorization': `Bot ${token}`
        }
      });

      if (response.status === 200) {
        console.log('bot is here')
      } else if (response.status === 404) {
        console.log('bot is not here')
      }
    } catch (error) {
      console.error('Error checking bot membership:', error);
    }
  };

  const randomDefaultIcon = () => {
    const random = Math.floor(Math.random() * 5) + 1;
    switch (random) {
      case 1: return discordBlue;
      case 2: return discordGreen;
      case 3: return discordGrey;
      case 4: return discordRed;
      case 5: return discordYellow;
    }
  }
  return (
    <div className='card' onClick={checkBot}>
      <h4>{guildName()}</h4>
      {guild.icon? 
      <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} alt={"Guild Icon"} draggable="false" width={"150px"} style={{'borderRadius': '5px'}}/>
      :<img src={randomDefaultIcon()} alt={"Guild Icon"} draggable="false" width={"150px"} style={{'borderRadius': '5px'}}/>}
    </div>
  )
}

export default ServerCard