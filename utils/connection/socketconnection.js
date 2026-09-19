import { Server } from "socket.io";

const socketIds = {};

var socketioconn = null;


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


const connectToSocket = async (socketserver)=>{
    try{
        const io = new Server(socketserver);

        io.on("connection", (socket) => {
            //socket.broadcast.emit("A user connected");
            let query = socket.handshake.query;

            addSocketIDToUser(query.uuid, socket.id)
            
            socket.on('TYPING',(data)=>{
            try{
                let userSocketID = findingSocketID(data.userid)
                if(!userSocketID){
                return
                }

                for(let index in userSocketID){
                io.to(userSocketID[index]).emit('TYPING',{
                    senderid:data.userid
                })
                }   
            }catch(e){
                console.log("Typing error : ",e)
            }
            })

            socket.on('STOP_TYPING',(data)=>{
            try{
            }catch(e){
                console.log("Stop Typing error : ",e)
            }
            })

            //
            socket.on("disconnect", (data) => {
            //Clean code here
            removeClosedConnectionID(data.userid, socket.id)
            });

            //
            socket.on("hello", (msg) => {
            socket.emit("hello", "world!");
            });

        });
        socketioconn = io;
        return io;
        }catch(e){
        console.log("Failed to connect to server ",e)
        return null
    }
}


const returnSocketID = async()=>{
    try{
        return socketIds
    }catch(e){
        console.log("Socket is ",e)
    }
}
export default {
    connectToSocket:connectToSocket,
    socketIds:socketIds,
    returnSocketID:returnSocketID
}

// module.exports.returnSocketID = async ()=>{
//     try{
//         return socketIds;
//     }catch(e){
//         console.log("Returon socket id")
//     }
// }

// module.exports.returnSocketValues = async ()=>{
//     try{
//         return socketioconn;
//     }catch(e){
//         console.log("Returon socket id")
//     }
// }

// module.exports.socketIds = socketIds;