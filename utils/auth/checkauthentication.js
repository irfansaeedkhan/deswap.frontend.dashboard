import {CheckLoginData, clearLoginData} from "./login";
import Router from "next/router";

module.exports.checkValidUser = async (serverprops)=>{
    try{
        
        if(!serverprops){
            await clearLoginData();
            Router.push("/logout");
            return
        }

        let loggedInUserData = await CheckLoginData();
        loggedInUserData = JSON.parse(loggedInUserData);
        
        if(!loggedInUserData||loggedInUserData.emailid==undefined){
            Router.push("/logout");
            return;
        }
        
        if(serverprops.role!="User"){
            Router.push("/logout");
            return;
        }

        if(serverprops.emailid!=loggedInUserData.emailid){
            Router.push("/logout");
            return;
        }
        if(!loggedInUserData.user){
            Router.push("/user/packs"); 
            return;
        }

    }catch(e){
        console.log("Failed to authenticate");
    }
}

module.exports.checkValidAdmin = async (serverprops)=>{
    try{
        if(!serverprops){
            await clearLoginData();
            Router.push("/logout");
            return
        }
        let loggedInUserData = await CheckLoginData();
        loggedInUserData = JSON.parse(loggedInUserData);
        if(!loggedInUserData||loggedInUserData.emailid==undefined){
            Router.push("/logout");
            return;
        }
        
        if(serverprops.role!="DeswapAdminRole"){
            Router.push("/logout");
            return;
        }

        if(serverprops.emailid!=loggedInUserData.emailid){
            Router.push("/logout");
            return;
        }

        if(loggedInUserData.user){
            Router.push("/user/packs"); 
            return;
        }

    }catch(e){
        console.log("Failed to authenticate");
    }
}