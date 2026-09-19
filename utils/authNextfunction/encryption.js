//import crypto
const crypto = require('crypto');
import fs from 'fs';

let algorithm = 'aes-256-ctr'
    let password = 'd6F3Efeq'

let encryptImage = (file) => {
    //encrypt uploaded file and make a .enc copy
    // console.log("file", file);
    let key = crypto.createHash('sha256').update(String("keuu")).digest('base64').substr(0, 32);
    let cipher = crypto.createCipheriv('aes-256-cbc', key, new Buffer('a2xhcgAAAAAAAAAA'));
    let encrypted = cipher.update(file, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    //write encrypted file to disk


    // let cipher = crypto.createCipheriv(algorithm,key,new Buffer('a2xhcgAAAAAAAAAA'));
    // console.log("dbdeb")
    // let crypted = Buffer.concat([cipher.update(new Buffer("hello",utf8)),cipher.final()])

    // console.log("crypted",crypted)

    fs.writeFileSync("tttestt" + '.enc', encrypted);
    //remove unencrypted file
    fs.unlinkSync(file);
    //fs.unlinkSync(file);
    return true;
}


let decryptImage = (file) => {

    //decrypt file and return decrypted file in response
    let key = crypto.createHash('sha256').update(String("keuu")).digest('base64').substr(0, 32);

    let decipher = crypto.createDecipheriv('aes-256-cbc', key, new Buffer('a2xhcgAAAAAAAAAA'));

    fs.readFile("D:/Users/DELL/project_Netheru/deswap/tttestt.enc", 'utf8', function (err, data) {

        // let decipher= crypto.createDecipheriv(algorithm,key,new Buffer('a2xhcgAAAAAAAAAA'))
        // var dec= Buffer.concat([decipher.update(data),decipher.final()])

        // console.log("dec",dec.toString())

        // Display the file content
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');


       fs.writeFileSync("tttestt4" + '.jpg', decrypted);
    });


    //return decrypted file
    return decrypted;
}

module.exports = {
    encryptImage,
    decryptImage
}