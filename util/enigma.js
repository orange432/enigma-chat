import { createCipheriv,createDecipheriv, createHash } from 'crypto';
import openpgp from 'openpgp'

/* Generates a sha256 hash
   @param (string) input - The string to hash
*/
const sha256 = (input) => {
    return createHash('sha256').update(input).digest('base64');
}


/* Generates a random string
    @param (number) length - The length of the random string to be returned;
*/
const randomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    const charLength = chars.length;

    for(let i=0;i<length;i++){

    }
}

/* Generates an OpenPGP keypair
    @param (string) username - username of the owner of the key
    @param (string) passphrase - passphrase used to store the key (default is the users salt)
*/

const generateKeyPair = async (username, passphrase) => {
    const {privateKey, publicKey} = await openpgp.generateKey({
        curve: 'brainpoolP512r1', 
        userIDs: [{name: username,email: `${username}@enigma.com`}],
        passphrase,
        format: 'armored'
    });
    return {publicKey, privateKey};
}

/* Encrypts text with AES-256-GCM 
    @param (string) text - Text to be enrypted
    @param (string) key - 32 byte key
    @param (string) iv - Initialization Vector
*/
const encryptText = (text,key,iv) =>{
  key = key.substr(0,32);
  let cipher = createCipheriv('aes-256-gcm',key,iv);
  let encryptedText = cipher.update(text,'utf8');
  encryptedText = Buffer.concat([encryptedText,cipher.final()]);
  return encryptedText.toString(Enigma.encoding);

}

/* Decrypts text with AES-256-GCM 
    @param (string) text - Text to be enrypted
    @param (string) key - 32 byte key
    @param (string) iv - Initialization Vector
*/
const decryptText = (text,key,iv) => {
  key = key.substr(0,32);
  let decipher = createDecipheriv('aes-256-gcm',key,iv);
  let decryptedText = decipher.update(text,Enigma.encoding,'utf8');
  return decryptedText;
}

/* Generates a session token based on the users id */
const generateSession = (user_id,started) => {
    const key = "sQ5kS5G6n5teMMBLwLNUTyMyMT9npM2r";
    const iv = "sT3MdbTLGELdSXbnFSQ8j7vPQd46EYgV";
    const sessionString = `${user_id}__${started}__${randomString(16)}`;
    const session = encryptText(sessionString,key,iv);
    return session;
}

/* Decrypts the session token */
const decryptSession = (token) => {
    const key = "sQ5kS5G6n5teMMBLwLNUTyMyMT9npM2r";
    const iv = "sT3MdbTLGELdSXbnFSQ8j7vPQd46EYgV";
    const decryptedSession = decryptText(token,key,iv);
    const [user_id,started] = decryptedSession.split('__');
    return {user_id,started};
}

export { sha256, randomString, generateKeyPair,encryptText, decryptText, generateSession, decryptSession }