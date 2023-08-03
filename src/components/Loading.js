import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from './App';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader.gif';

const Loading = () => {
    const { setToken, login, setUserData, setGuilds, guilds } = useContext(AuthContext);
    const navigate = useNavigate();
    // console.log('test');
    const [first, setFirst] = useState(true)
    // if(!first){
    //     setFirst(false);
    // }

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        // console.log(code);
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/auth/callback?code=${code}`, {
                    method: 'POST',
                });
                const authData = await response.json();  
                console.log(authData) 
                setToken(authData.access_token)                         
                await Promise.all([
                    getUserData(authData.access_token),
                    getGuilds(authData.access_token)
                ]);
                navigate('/dashboard'); 
            } catch (error) {
                console.error('Error during authentication:', error);
            }
        };
        if (first){
            setFirst(false);
            fetchData();
        }
    }, []);

    const getUserData = async (token) => {
        try {
            const response = await fetch(`https://discordapp.com/api/users/@me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await response.json();
            console.log(userData);
            setUserData(userData); 
            login(userData); 
        } catch (error) {
            console.error('Error while fetching user data:', error);
        }
    }

    const getGuilds = async (token) => {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const guildData = await response.json();
            console.log(guildData);
            if(!guildData.retry_after){
                setGuilds(guildData);
                // console.log(guildData)
                localStorage.setItem('guildData', JSON.stringify(guildData));
            }
        } catch (error) {
            console.error('Error fetching guilds:', error);
        }
    }

    return (
        <div>
            Loading
            <img src={loader} style={{ width: '50%' }} alt="loading..." />
        </div>
    );
}

export default Loading;
