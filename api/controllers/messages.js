import Message from '../models/message.js';
import User from '../models/user.js'
import { decryptWithPGP, encryptWithPGP } from '../../util/enigma.js';

/* Gets all the messages sent to the user */
export const getMessages = async (username) => {
  try{
    await Message.sync();
    let messages = await Message.findAll({where: {to: username}});
    const allMessages = messages.map(message=>message.dataValues);
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

    // Encrypt with PGP
    let encryptedMessage = await encryptWithPGP(content,receiver.publicKey)

    // Create the message
    await Message.sync();
    await Message.create({
      from,
      to: receiver.username,
      content: encryptedMessage,
      time: Date.now()
    })
    return {success: true, message: "Message sent." , code: "SUCCESS"}
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.", code: "DATABASE_ERROR"};
  }
}

/* Decrypts a message */
export const decryptMessage = async (message_id,user_id) => {
  try{
    let receiver = await User.findOne({where:{id: user_id}});
    let message = await Message.findOne({where:{id: message_id}});
    
    if(receiver.privateKey==null || receiver.prviateKey==''){
      return {success: false, message: "User doesn't have private key", code: "NO_PRIVATKEY"}
    }
    if(message.to!==receiver.username){
      return {success: false, message: "Not your message.", code: "WRONG_USER"}
    }
    const messageContent = await decryptWithPGP(message.content,receiver.privateKey,receiver.salt);
    return {success: true, content: messageContent, message: "Decryption successful.", code: "SUCCESS"}
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.", code: "DATABASE_ERROR"}; // could also be pgp error
  }
}

/* Deletes a message from a users inbox */
export const deleteMessage = async (message_id,username) => {
  try{
    let message = await Message.findOne({where: {id: message_id}});

    if(message.username!==username){
      return {success: false, message: "Not your message.", code: "WRONG_USER"};
    }
    await Message.destroy({where: {id: message.id}});
    return {success: true, message: "Deletion successful.", code: "SUCCESS"};
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.", code: "DATABASE_ERROR"};
  }

}