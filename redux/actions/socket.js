export const socketActionType = {
    SOCKET_CONNECT:'SOCKET_CONNECT',
    SOCKET_DISCONNECTED:'SOCKET_DISCONNECTED',
    SOCKET_VALUES:'SOCKET_VALUES',
}

export const connectToSocket = (socketConnData) => (dispatch) => {
    return dispatch({ type: socketActionType.SOCKET_CONNECT, socketConn:socketConnData.socketConn})
}

export const disconnectFromSocket = () => (dispatch) => {
    return dispatch({ type: socketActionType.SOCKET_DISCONNECTED })
}

export const getSocketValue = () => (dispatch) => {
    return dispatch({ type: socketActionType.SOCKET_VALUES })
}