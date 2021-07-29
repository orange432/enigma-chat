import Message from '../models/message.js';
import User from '../models/user.js'

/* Gets all the messages sent to the user */
export const getMessages = async (username) => {
  try{
    await Message.sync();
    let messages = await Message.findAll({where: {to: username}});
    const allMessages = messages.map(message=>message.dataValues);
    console.log(allMessages)
    return allMessages;
  }catch(err){
    console.log(err);
    return [];
  }
}

/* Sends a message to the given username */
export const sendMessage = async (from,to,content) => {
  try{
    // Get the user from the username in the to argument
    let receiver = await User.findOne({where: {username: to}});
    if(!receiver){
      return {success: false, message: "User doesn't exist.", code: "INVALID_USER"}
    }
    console.log(from,to,content);
    // Create the message
    await Message.sync();
    await Message.create({
      from,
      to: receiver.username,
      content,
      time: Date.now()
    })
    return {success: true, message: "Message sent." , code: "SUCCESS"}
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.", code: "DATABASE_ERROR"};
  }
}