import {randomBytes} from "crypto";

module.exports.useruniqueid = async (length=10)=>{
    try {
		return await randomBytes(uuid).toString('hex');
	} catch (e) {
		throw e;
	}   
}