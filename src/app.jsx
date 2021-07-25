import React, {useState,useEffect} from 'react'
import './main.scss';

import LoginRegister from './components/login-register';

const App = () => {
  const [loading,setLoading] = useState(true);
  const [loggedIn,setLoggedIn] = useState(false);

  const authorize = () => {
    const token = sessionStorage.getItem('session');
    const query = `
    query{
      AuthorizeSession(session: "${token}"){
        success
        message
        code
        username
      }
    }
    `
    fetch('/_graphql',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({query})
    })
    .then(res=>res.json())
    .then(({data})=>{
      if(data.AuthorizeSession.success){
        setLoggedIn(true)
      }else{
        setLoggedIn(false);
      }
      setLoading(false);
    })
  }

  useEffect(()=>{
    // No session data entered.
    if(sessionStorage.getItem('session')===null){
      setLoading(false);
      setLoggedIn(false);
    }else{
      authorize();
    }
  },[]);
  

  // Loading Screen
  if(loading){
    return (
      <div className="loading-screen">
        <h1 className="text-center">Loading...</h1>
      </div>
    )
  }

  // Login/Registration Form
  if(!loggedIn){
    return (
      <div>
        <LoginRegister/>
      </div>
    )
  }

  return(
    <div>
      <h1>You are Logged in!</h1>
    </div>
  )
}

export default App
