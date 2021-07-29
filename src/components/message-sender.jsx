import React, {useState} from 'react'

const MessageSender = () => {
  const [receiver,setReceiver] = useState('');
  const [message,setMessage] = useState('');

  const sendMessage = e => {
    e.preventDefault();
    const token = sessionStorage.getItem('session');
    const query = `
      mutation{
        SendMessage(input: {session: "${token}", receiver: "${receiver}" message: "${message}"}){
          success
          message
        }
      }
    `
    fetch('/_graphql',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({query})
    })
    .then(res=>res.json())
    .then(({data})=>{
      console.log(data);
    })
  }
  return (
    <div className="message-sender">
      <form onSubmit={sendMessage}>
        <label className="label">Receiver's Username</label>
        <input type="text" className="input" onChange={e=>setReceiver(e.target.value)}/>
        <label className="label">Message</label>
        <textarea className="textarea" onChange={e=>setMessage(e.target.value)}></textarea>
        <button type="submit" className="btn-primary">Send</button>
      </form>
    </div>
  )
}

export default MessageSender
