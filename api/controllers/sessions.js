import User from '../models/user.js';
import validator from 'validator';
import Session from "../models/session.js";
import { generateSession,decryptSession,sha256 } from "../../util/enigma.js";

export const login = async (username,password) => {
  try{
    if(!validator.isAlphanumeric(username) || username.length<5 || password.length<5){
      return {success: false,message: "Invalid credentials.",code: "INVALID_CREDENTIALS"};
    }
    User.sync();
    let user = await User.findOne({where:{username}});
    // Check if user exists
    if(!user){
      return {success: false, message: "Wrong username/password combination", code: "WRONG_CREDENTIALS"};
    }
    // Check password
    if(sha256(`${user.salt}${password}`)===user.password){
      // Username and password valid, log in
      const started = Date.now();
      const session = generateSession(user.id,started);
      await Session.sync()
      let exists = await Session.findOne({where:{id: session}});
      if(exists){
        return {success: false, message: "Database error.  Please try again", code: "DATABASE_ERROR"};
      }
      await Session.create({
        id: session,
        user_id: user.id,
        started,
        expiry: Date.now() + 15*60*1000
      });
      return {success: true, message: "Login Successful.", code: "SUCCESS", session};
    }else{
      return {success: false, message: "Wrong username/password combination", code: "WRONG_CREDENTIALS"};
    }
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.  Please try again", code: "DATABASE_ERROR"};
  }
}

export const authorizeSession = async (token) => {
  try{
    let session = await Session.findOne({where: {
      id: token
    }})
    // Check for invalid id
    if(!session){
      return {success: false, message: "Session Invalid.", code: "SESSION_INVALID"};
    }
    // Check for expired Id
    if(session.expiry<Date.now()){
      await Session.destroy({where:{}})
      return {success: false, message: "Session Expired.", code: "SESSION_EXPIRED"};
    }

    // Get User Details
    let user = await User.findOne({where: {id: session.user_id}});
    return {success: true, message: "Session is valid", code: "SUCCESS",username: user.username, user_id: user.id};
  }catch(err){
    console.log(err);
    return {success: false, message: "Database error.  Please try again", code: "DATABASE_ERROR"};
  }
}
