import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import loginIcon from '../assets/login3.png'
import cow from '../assets/cow.png'
import logoutIcon from "../assets/logout5.png"

const Navbar = ({user, login, logout}) => {
  const navigate = useNavigate()
  const imageStyle = {
      'borderRadius': '50px',
      'maxHeight': '40px',
      'marginLeft':'10px'
  }
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <ul className="nav-list">
        <li className='sitelogo'>
          <NavLink exact to="/">WANGUS BOT <img src={cow} className="siteImg" style={{'borderRadius': '10px','maxHeight': '40px','marginLeft':'10px'}}/></NavLink>
        </li>
        <li className="navitem">
          <NavLink to="/commands">Commands</NavLink>
        </li>
        <li className="navitem">
          <NavLink to="/status">Bot Status</NavLink>
        </li>
        {user ? (
          <li className="navitem">
            <NavLink to="/dashboard" >
               @{user.username}
            </NavLink>           
          </li>
        ):(<li className="navitem">
          <a href="#" exact="true" onClick={login} >
            Login
          </a>
        </li>)}
        {user ? (
          <li className="navitem">
            <NavLink to="/dashboard" >
            <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} alt="Avatar" style={imageStyle}/>
            </NavLink>              
          </li>
        ):         
         <li className="navitem">
          <a href="#" exact="true" onClick={login} >
          <img src={loginIcon} alt="Avatar" style={{'borderRadius': '50%', width:'55px', 'marginRight': '-10px', height:'55px'}}/>
          </a>           
      </li>} 
        {user ? <li className="navitem">
          <img src={logoutIcon} onClick={handleLogout} style={{marginRight: "-25px", marginTop:'4px', padding:'0px', marginLeft:'0px', height: '50px'}}/>
        </li>:null}        

      </ul>
    </nav>

  );
}

export default Navbar;




