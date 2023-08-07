import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from './App';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader.gif';

const Loading = () => {
    const { setToken, setUserData, setGuilds, setSessionData, sessionData } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        let isMounted = true; // Flag to track unmounting

        const fetchAndProcessData = async () => {
            try {
                console.log('checkpoint 1!')
                const searchParams = new URLSearchParams(window.location.search);
                const code = searchParams.get('code');

                console.log('checkpoint 2!')
                const authData = await fetchAuthData(code);
                setToken(authData.access_token);

                console.log('checkpoint 3!')
                const userData = await getUserData(authData.access_token);
                setUserData(userData);

                console.log('checkpoint 4!')
                const guildData = await getGuilds(authData.access_token);
                if (!guildData.retry_after) {
                    setGuilds(guildData);

                    console.log('checkpoint 5!')
                    const newSessionData = await registerUser(authData, userData);
                    if (!newSessionData.message){
                        setSessionData(newSessionData);
                    }
                    console.log(newSessionData);
    
                    console.log('checkpoint 6!');
                    console.log(guildData);
                    await registerServers(guildData, userData);

                    console.log('checkpoint 7!');
                    if (isMounted) {
                        console.log('Component is still mounted. Proceeding with navigation.');
                        navigate('/dashboard');
                    }
                    if(!isMounted){
                        console.log('not mounted going anyways')
                        navigate('/dashboard');
                    }
                }
                // After both registerUser and registerServers are completed

            } catch (error) {
                console.error('Error during authentication:', error);
                if (isMounted) {
                    navigate('/');
                }
            }
        };

        fetchAndProcessData();
        // Cleanup function to handle unmounting
        return () => {
            isMounted = false;
            console.log('Component is unmounted.');
        };
    }, []);

    const fetchAuthData = async (code) => {
        const response = await fetch(`http://127.0.0.1:5555/auth/callback?code=${code}`, {
            method: 'POST',
        });
        return response.json();
    };

    const getUserData = async (token) => {
        const response = await fetch(`https://discordapp.com/api/users/@me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
    
        const userData = await response.json(); // Extract JSON data from the response
        return userData;
    };
    

    const getGuilds = async (token) => {
        const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    };

    const registerUser = async (authData, userData) => {
        console.log( {user_name: userData.username,
            user_global_name: userData.global_name,
            user_id: userData.id,
            user_avatar: userData.avatar,
            authorization_token: authData.access_token,
            refresh_token: authData.refresh_token})
        const response = await fetch('http://127.0.0.1:5555/registeruser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: userData.username,
                user_global_name: userData.global_name,
                user_id: userData.id,
                user_avatar: userData.avatar,
                authorization_token: authData.access_token,
                refresh_token: authData.refresh_token,
            }),
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            return responseData;
        } else {
            console.error('Registration failed:', responseData);
            throw new Error('Registration failed');
        }
    };

    const registerServers = async (guildData, userData) => {
        console.log(guildData);
        const serverRegistrationPromises = guildData.map((guild) => {
            
            console.log('checkpoint 10+!')
            return fetch('http://127.0.0.1:5555/registerserver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    discord_id: guild.id,
                    discord_name: guild.name,
                    discord_icon: guild.icon,
                    session_id: userData.id,
                    session_user_id: userData.id,
                    session_username: userData.username,
                }),
            });
        });

        const serverRegistrationResponses = await Promise.all(serverRegistrationPromises);
        console.log('Servers registered:', serverRegistrationResponses);
    };

    return (
        <div>
            Loading
            <img src={loader} style={{ width: '50%' }} alt="loading..." />
        </div>
    );
};

export default Loading;
