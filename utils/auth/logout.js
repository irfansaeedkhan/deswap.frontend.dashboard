import Router from "next/router";

const logoutUser = async (event)=>{
    if(event.key=="logout-event"){
        Router.push("/logout");
    }
}

module.exports.logoutUser = logoutUser;
module.exports.attachLogoutEvent = async ()=>{
    try{
        window.addEventListener('storage', logoutUser, false);
    }catch(e){
        console.log("Failed to attach event");
    }
}

module.exports.dispatchLogoutEvent = async ()=>{
    try{
        let localStorage = window.localStorage;
        await localStorage.setItem('logout-event', 'logout');
        await window.dispatchEvent(new Event('storage'));
    }catch(e){
        console.log("Failed to dispatch event");
    }
}