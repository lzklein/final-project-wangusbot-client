import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom';

const ServerRedirect = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        const redirect = localStorage.getItem('redirect');
        console.log(redirect)
        // TODO if redirect in backend server list, go here, else go back to dashboard or something
        navigate(`/server/${redirect}`)
    },[])
  return (
    <div>Loading . . .</div>
  )
}

export default ServerRedirect