import Message from '../models/message.js';
import User from '../models/user.js'

/* Gets all the messages sent to the user */
export const getMessages = async (user_id) => {
  try{
    let messages = await Message.findAll({where: {to: user_id}});
    return messages;
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
    // Create the message
    
    await Message.create({
      from,
      to: receiver.id,
      content,
      time: Date.now()
    })
    return {success: true, message: "Message sent." , code: "SUCCESS"}
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.", code: "DATABASE_ERROR"};
  }
}