import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import usersModal from "../../../models/Users";
import usersNetwork from "../../../models/users/usersNetworks";

module.exports.fetchUserDownline = async(userid, defaultDownline=2)=>{
    try{
        let result = [];
        let currentuserid = [];
        await getMongoDBConnection();
        currentuserid.push(userid);
        let downlineexits = true;
        for(let i=0; i<defaultDownline; i++){
            //
            if(downlineexits){
                //
                let userInfo = await usersNetwork.find({"sponsoruid":{"$in":currentuserid}}).populate('uuid','username walletaddress uuid');
                if(!userInfo){
                    downlineexits=false;
                }
                
                currentuserid = userInfo.map((value)=>{    
                    return value.uuid._id;
                });
                
                let userData = userInfo.map((value)=>{
                    return {
                        walletaddress:value.uuid.walletaddress[value.uuid.walletaddress.length-1],
                        uuid:value.uuid.uuid,
                    }
                })
                result.push(userData);
            }else{
                result.push(null);
            }
        }
        return result;
    }catch(e){
        console.log("Failed to downline ",e)
    }
}