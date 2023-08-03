import React from 'react';
import { NavLink } from 'react-router-dom';
import loginIcon from '../assets/login3.png'
const Navbar = ({user, login}) => {
  return (
    <nav>
      <ul>        
        {user ? (
          <li>
            <NavLink to="/dashboard" className="profile">
            <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} alt="Avatar" style={{'borderRadius': '50%', width:'40px', 'marginLeft': '10px'}}/>
            </NavLink>              
          </li>
        ):         
         <li>
          <a href="#" exact="true" onClick={login} className="profile">
          <img src={loginIcon} alt="Avatar" style={{'borderRadius': '50%', width:'40px', 'marginLeft': '10px'}}/>
          </a>           
      </li>} 
        {user ? (
          <li>
            <NavLink to="/dashboard" className="profile">
               {user.username}
            </NavLink>           
          </li>
        ):(<li>
          <a href="#" exact="true" onClick={login} className="profile">
            Login
          </a>
        </li>)}
        <li>
          <NavLink to="/commands">Commands</NavLink>
        </li>
        <li>
          <NavLink to="/status">Bot Status</NavLink>
        </li>
        <li>
          <NavLink exact to="/">Site Title</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;




