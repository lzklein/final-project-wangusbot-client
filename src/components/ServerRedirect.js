import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom';

const ServerRedirect = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        const redirect = localStorage.getItem('redirect');
        console.log(redirect)
        fetch('/botcheck', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
              server_name: redirect
          })
        })
        .then(r=> r.json())
        .then(redirectData=>{
          if(redirectData.message){
            navigate(`/dashboard`)
          }
          else{
            navigate(`/server/${redirect}`)
          }
        })
    },[])
  return (
    <div>Loading . . .</div>
  )
}

export default ServerRedirect