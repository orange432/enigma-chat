import { createHash } from 'crypto';
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


export { sha256, randomString, generateKeyPair }