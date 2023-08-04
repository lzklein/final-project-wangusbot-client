import React, { useContext } from 'react';
import { AuthContext } from './App';
import ServerCard from "./ServerCard";

const Dashboard = () => {
  const { guilds } = useContext(AuthContext);

  if (guilds && Array.isArray(guilds)) {
    const renderGuilds = () => {
      return guilds.map((guild) => {
        return <ServerCard guild={guild} key={guild.id} />;
      });
    };
  
    return (
      <div>
        <h2 style={{'marginBottom':'40px'}}>== Your Servers ==</h2>
        {/* <button onClick={handleInvite}>Invite the bot</button> */}
        <div className="grid">{renderGuilds()}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default Dashboard;
