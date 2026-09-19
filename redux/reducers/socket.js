import {socketActionType} from '../actions/socket';

const socketReducer = (state = { socketConn:null,socketConnected:false}, action) => {
    try{
        switch (action.type) {
            case socketActionType.SOCKET_CONNECT:
                return {...state, socketConnected: true, socketConn:action.socketConn};
            case socketActionType.SOCKET_DISCONNECTED:
                return {...state, socketConnected: false, socketConn:null};
            case socketActionType.SOCKET_VALUES:
                    return {...state};
            default:
                return {...state};
        }
    }catch(e){
        console.log("Socket reducer error ",e)
    }
};

export default socketReducer;