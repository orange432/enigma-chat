import React,{ useEffect, useState } from 'react'

const Messages = (props) => {
  const [messages,setMessages] = useState([]);

  useEffect(()=>{
    getMessages();
  },[])

  const decryptMessage = (messageId) => {
    const token = sessionStorage.getItem('session');
    const query = `
    query{
      DecryptMessage(session: "${token}",message: ${messageId}){
        success
        content
        message
      }
    }
    `
    fetch("/_graphql",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({query})
    })
    .then(res=>res.json())
    .then(({data})=>{

    })
  }

  const getMessages = () => {
    const token = sessionStorage.getItem('session');
    const query = `
    query{
      GetMessages(session: "${token}"){
          id
          from
          to
          content
          time
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
      console.log(data);
      setMessages(data.GetMessages);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  if (messages.length===0){
    return (
      <div>
        There are no messages.
      </div>
    )
  }
  return (
    <div className="messages">
      {messages.map((message,k)=>(
        <div className="message">
          <div className="message__header">
            From: {message.username} - {message.time.toString()}
          </div>
          <div className="message__content">
            {message.content}
          </div>
          <div className="message__controls">
            <button type="button" className="btn-primary">Decrypt</button>
            <button type="button" className="btn-secondary">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Messages
