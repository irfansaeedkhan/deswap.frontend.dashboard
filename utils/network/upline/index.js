import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import usersModal from "../../../models/Users";
import usersNetwork from "../../../models/users/usersNetworks";

module.exports.fetchUserUpline = async(userid, defaultUpline=2)=>{
    try{
        let result = [];
        let findparent = true;
        let currentuserid = userid;
        await getMongoDBConnection();
        //
        for(let i=0; i<defaultUpline; i++){
            //
            if(findparent){
                //
                let userNetwork = await usersNetwork.findOne({
                    uuid:currentuserid
                }).populate('sponsoruid');

                if(userNetwork.sponsoruid==undefined||userNetwork.sponsoruid==null){
                    //No parent so
                    findparent = false;
                    result.push(null);
                }else{
                    //
                    result.push({
                        username:userNetwork.sponsoruid.username,
                        id:userNetwork.sponsoruid._id,
                        emailVerified:userNetwork.sponsoruid.emailVerified,
                        uuid:userNetwork.sponsoruid.uuid,
                        MetaMaskAccountPublicKey:userNetwork.sponsoruid.walletaddress[userNetwork.sponsoruid.walletaddress.length-1]
                    });
                    currentuserid = userNetwork.sponsoruid._id;
                }
            }else{
                result.push(null);
            }
        }
        return result;
    }catch(e){
        console.log("Failed to upline ",e)
    } 
}