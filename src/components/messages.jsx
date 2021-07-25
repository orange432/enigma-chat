import React from 'react'

const Messages = (props) => {
  return (
    <div className="messages">
      {props.messages.map((message,k)=>(
        <div className="message">
          <div className="message__header">
            From: {message.username} - {message.time.toString()}
          </div>
          <div className="message__content">
            {message.content}
          </div>
          <div className="message__controls">
            <button type="button">Decrypt</button>
            <button type="button">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Messages
