import { Server } from "socket.io";
import usermiddleware from "../../middleware/usermiddleware";
import {typingMessageEvent, sendMessageEvent, typingStop, logoutUserDevice} from "../../utils/socket/serverfunctions";
const socketIds = {};

const findingSocketID = (uid)=>{
  try{
    if(socketIds[uid]==undefined||socketIds[uid]==null){
      return null
    }
    return socketIds[uid]
  }catch(e){
    console.log("Failed to find id : ",e)
    return null
  }
}

const addSocketIDToUser = (userid, socketid)=>{
  try{
    //
    if(socketIds[userid]==undefined||socketIds[userid]==null){
      socketIds[userid] = []
      socketIds[userid].push(socketid)
    }else{
      if(!socketIds[userid].includes(socketid)){
        socketIds[userid].push(socketid)
      }
    }
    
    return true
  }catch(e){
    console.log("Failed to add ",e)
    return false
  }
}

const removeClosedConnectionID = (userid, socketid)=>{
  try{
    
    if(socketIds[userid]==undefined||socketIds[userid]==null){
      return 
    }
    if(!socketIds[userid].includes(socketid)){
      return
    }

    let index = socketIds[userid].indexOf(socketid)
    
    if(index>-1){
      socketIds[userid].splice(index,1)
    }
    
  }catch(e){
    console.log(e)
    return
  }
}


const connectToSocket = (socketserver)=>{
  try{
    const io = new Server(socketserver);

    io.on("connection", (socket) => {
      //socket.broadcast.emit("A user connected");
      let query = socket.handshake.query;

      addSocketIDToUser(query.uuid, socket.id)
      
      socket.on('TYPING',async (data)=>{
        try{
          await typingMessageEvent(data, socketIds, io)
        }catch(e){
          console.log("Typing start : ",e)
        }
      })

      socket.on('STOP_TYPING',async (data)=>{
        try{
          await typingStop(data, socketIds, io)   
        }catch(e){
          console.log("Stop Typing error : ",e)
        }
      })

      socket.on('SEND_MESSAGE',async (data)=>{
        try{
          await sendMessageEvent(data, socketIds, io)   
        }catch(e){
          console.log("Sending Typing error : ",e)
        }
      })

      socket.on('LOGOUT_USER_DEVICE',async (data)=>{
        try{
          await logoutUserDevice(data, socketIds, io)   
        }catch(e){
          console.log("Sending Typing error : ",e)
        }
      })

      //
      socket.on("disconnect", (data) => {
        //data = SanitizeRequestObjectSync(data);
        removeClosedConnectionID(data.userid, socket.id, io)
      });

      socket.on("disconnecting", (data) => {
        //data = SanitizeRequestObjectSync(data);
        removeClosedConnectionID(data.userid, socket.id, io)
      });

    });
    return io;
  }catch(e){
    console.log("Failed to connect to server ",e)
    return null
  }
}

const ioHandler = (req, res) => {
  
  if (!res.socket.server.io) {
    //
    let io = connectToSocket(res.socket.server)

    res.socket.server.io = io;
    
  } else {
    console.log("socket.io already running");
  }
  res.end();
  console.log("Ending response")
};

export const config = {
  api: {
    bodyParser: false,
  },
};

//export default ioHandler;
export default usermiddleware(ioHandler);
