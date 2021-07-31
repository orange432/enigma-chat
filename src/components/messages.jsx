import React,{ useEffect, useState } from 'react'
import './messages.scss'

const Messages = (props) => {
  const [messages,setMessages] = useState([]);

  useEffect(()=>{
    getMessages();
    setInterval(()=>getMessages(),7500);
  },[])

  const deleteMessage = messageId => {
    const token = sessionStorage.getItem('session');
    const query = `
      mutation{
        DeleteMessage(session: "${token}", id: ${messageId}){
          success
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
      if(data.DeleteMessage.success){
        getMessages();
      }else{
        alert(data.message);
      }
    })
  }

  const decryptMessage = (messageId) => {
    const token = sessionStorage.getItem('session');
    const query = `
    query{
      DecryptMessage(session: "${token}",id: ${messageId}){
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
      if(data.DecryptMessage.success){
        alert(data.DecryptMessage.content);
      }else{
        alert(data.DecryptMessage.message);
      }
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
        <div className="message" key={k}>
          <div className="message__header">
            From: {message.username} - {message.time.toString()}
          </div>
          <div className="message__content">
            <textarea className="textarea" disabled={true} value={message.content}></textarea>
          </div>
          <div className="message__controls">
            <button type="button" className="btn-primary" onClick={()=>decryptMessage(message.id)}>Decrypt</button>
            <button type="button" className="btn-secondary" onClick={()=>deleteMessage(message.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Messages
