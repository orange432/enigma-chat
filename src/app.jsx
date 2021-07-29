import React, {useState,useEffect} from 'react'
import './main.scss';

import LoginRegister from './components/login-register';
import Messages from './components/messages';
import MessageSender from './components/message-sender';

const App = () => {
  const [loading,setLoading] = useState(true);
  const [loggedIn,setLoggedIn] = useState(false);
  const [messages,setMessages] = useState([]);

  

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
      <h1>Enimga</h1>
      <div style={{display: 'flex'}}>
        <div style={{margin: 50, width: 480}}>
          <h2>Send a Message</h2>
          <MessageSender/>
        </div>
        <div style={{margin: 50}}>
          <h2>Messsages</h2>
          <Messages/>
        </div>
      </div>
    </div>
  )
}

export default App
