import { io } from "socket.io-client";


module.exports.connectToSocketFrontend = async (uuid, publickey)=>{
    try{
        //
        let fetchResult = await fetch(`${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/socket`);
        let socket = io({
            query: {
              uuid: uuid,
              publickey:publickey
            }
        })

        socket.on('connect', () => {
        })

        socket.on("connect_error", () => {
            //socket.auth.token = "abcd";
            socket.connect();
        });
        //

        return socket;

    }catch(e){
        console.log("Failed to connect to socket : ",e);
        return null;
    }
}