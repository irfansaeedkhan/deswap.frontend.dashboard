import {SanitizeRequestStringSync, SanitizeRequestObject} from "../common/sanitize"

const findingSocketID = (uid, socketID) => {
  try {
    if (socketID[uid] == undefined || socketID[uid] == null) {
      return null;
    }
    return socketID[uid];
  } catch (e) {
    console.log("Failed to find id : ", e);
    return null;
  }
};

const addSocketIDToUser = (userid, socketid, socketIDs) => {
  try {
    //
    if (socketIDs[userid] == undefined || socketIDs[userid] == null) {
      socketIDs[userid] = [];
      socketIDs[userid].push(socketid);
    } else {
      if (!socketIDs[userid].includes(socketid)) {
        socketIDs[userid].push(socketid);
      }
    }
    return socketIDs;
  } catch (e) {
    console.log("Failed to add ", e);
    return socketIDs;
  }
};

const removeClosedConnectionID = (userid, socketid, socketIDs) => {
  try {
    
    if (socketIDs[userid] == undefined || socketIDs[userid] == null) {
      return socketIDs;
    }
    if (!socketIDs[userid].includes(socketid)) {
      return socketIDs;
    }

    let index = socketIDs[userid].indexOf(socketid);

    if (index > -1) {
      socketIDs[userid].splice(index, 1);
    }

    return socketIDs;
  } catch (e) {
    console.log(e);
    return socketIDs;
  }
};

module.exports.findingSocketID = findingSocketID;
module.exports.addSocketIDToUser = addSocketIDToUser;
module.exports.removeClosedConnectionID = removeClosedConnectionID;

module.exports.typingMessageEvent = async (data, socketIDs, socketIOObj) => {
  try {
    data = await SanitizeRequestObject(data)
    let userSocketID = findingSocketID(data.receiver, socketIDs);
    if (!userSocketID) {
      return;
    }

    for (let index in userSocketID) {
      socketIOObj.to(userSocketID[index]).emit("RECEIVE_TYPING", {
        senderid: await SanitizeRequestStringSync(data.userid),
        receiverid: await SanitizeRequestStringSync(data.receiver)
      });
    }
  } catch (e) {
    console.log("Sending message to socket ", e);
  }
};

module.exports.sendMessageEvent = async (data, socketIDs, socketIOObj) => {
  try {
    data = await SanitizeRequestObject(data)
    let userSocketID = findingSocketID(data.receiver, socketIDs);
    if (!userSocketID) {
      return;
    }

    for (let index in userSocketID) {
      socketIOObj.to(userSocketID[index]).emit("RECEIVE_MESSAGE", {
        // senderid: data.userid,
        message: (data),
      });
    }
  } catch (e) {
    console.log("Failed to send event ", e);
  }
};

module.exports.typingStop = async (data, socketIDs, socketIOObj) => {
  try {
    data = await SanitizeRequestObject(data)
    let userSocketID = findingSocketID(data.receiver, socketIDs);
    if (!userSocketID) {
      return;
    }

    for (let index in userSocketID) {
      socketIOObj.to(userSocketID[index]).emit("RECEIVE_STOP_TYPING", {
        senderid: data.userid,
        receiver: data.receiver
      });
    }
  } catch (e) {
    console.log("Failed to type stop ", e);
  }
};

module.exports.logoutUserDevice = async (data, socketIDs, socketIOObj) => {
  try {

    data = await SanitizeRequestObject(data)
    if(data.senderid!=data.receiver){
      return;
    }

    //Receiver socket id
    let userSocketID = findingSocketID(data.receiver, socketIDs);
    if (!userSocketID) {
      return;
    }

    //
    for (let index in userSocketID) {
      socketIOObj.to(userSocketID[index]).emit("RECEIVE_LOGOUT_USER_DEVICE", {
        senderid: data.receiver,
        receiver: data.receiver,
        sessionid: data.sessionid
      });
    }
  } catch (e) {
    console.log("Failed to type stop ", e);
  }
};