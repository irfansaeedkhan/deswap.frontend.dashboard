import Web3 from "web3";

module.exports.emailValidation = async (emailid)=>{
    try {

		emailid = emailid.trim();
        emailid = emailid.toLowerCase();
        if(emailid===""){
            return {result:false,error:"Please enter email id"};
        }

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(emailid)){
            return {result:false,error:"Invalid Email ID"};
        }
        return {result:true,error:""};
	} catch (e) {
        //console.error("Failed to check email validation : ",e);
		console.log("Failed to check email validation");
	}   
}

module.exports.passwordValidation = async (password)=>{
    try {
		password = password.trim();
        if(password===""){
            return {result:false,error:"Please enter password"};
        }

        if(password.length<8){
            return {result:false,error:"Minimum password lenght should be 8"};
        }

        return {result:true,error:""};
	} catch (e) {
		//console.error("Failed to check email validation : ",e);
		console.log("Failed to check email validation");
	}   
}

module.exports.checkPublicKey = async(publicKey)=>{
    try{

        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.POLYGON_CHAIN_LINK));
        
        let checkValidAdminAddress = await web3.utils.isAddress(publicKey);

        if(checkValidAdminAddress){
            return {result:true,error:""};
        }

        return {result:false,error:"Failed to verify public address"};

    }catch(e){
        return {result:false,error:"Failed to verify public address"};
    }
}