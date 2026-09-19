import Router from "next/router";

module.exports.setloginData = async (data)=>{
    try{
        let localStorage = window.localStorage;
        await localStorage.setItem('login', data);
    }catch(e){
        console.log("Failed to set login");
    }
}

module.exports.clearLoginData = async ()=>{
    try{
        let localStorage = window.localStorage;
        await localStorage.setItem('login', '');
    }catch(e){
        console.log("Failed to clear");
    }
}

const CheckLoginData = async()=>{
    try{
        
        let localStorage = await window.localStorage;
        let result = await localStorage.getItem('login');
        if(!result){
            Router.push("/logout");
        }
        return result;
    }catch(e){
        console.log(e);
    }
}

module.exports.CheckLoginData = CheckLoginData;

module.exports.attachLoginEvent = async () =>{
    await window.addEventListener('focus',CheckLoginData);
}

module.exports.attachdeFocusEvent = async () =>{
    await window.addEventListener('blur',CheckLoginData);
}