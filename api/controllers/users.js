import validator from 'validator';
import User from '../models/user.js';
import { randomString, sha256,generateKeyPair } from '../../util/enigma.js';

/* Creates a user with the given details if the user doesn't already exist
  @param (object) details - An object with the properties username and password
*/
const createUser = async (details) => {
    try{
        // Check if input is valid
        if(!validator.isAlphanumeric(details.username) || details.username.length<5 || details.password.length<5){
            return {success: false,message: "Invalid credentials.",code: "INVALID_CREDENTIALS"};
        }
        await User.sync();

        // Check if user exists
        let user = await User.findOne({where: {username: details.username}})
        if(user){
            return {success: false,message: "Username already exists",code: "USER_EXISTS"};
        }

        // Generate the salt + hashed password
        const salt = randomString(64);
        const password = sha256(`${salt}${details.password}`);

        // Generate the key pair
        const {publicKey, privateKey} = await generateKeyPair(details.username,salt);

        await User.create({
            username: details.username,
            password,
            salt,
            publicKey,
            privateKey
        });
        return {success: true, message: "User created successfully.", code: "SUCCESS"};
    }catch(err){
        console.log(err);
        return {success: false, message: "Database error.  Please try again", code:"DATABASE_ERROR"}
    }
}

export {createUser}