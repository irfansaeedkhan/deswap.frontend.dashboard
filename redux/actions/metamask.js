export const metaMaskActionTypes = {
    METAMASK_CONNECTED: 'METAMASK_CONNECTED',
    METAMASK_DISCONNECTED: 'METAMASK_DISCONNECTED',
    TRANSACTION_INPROGRESS: 'METAMASK_TRANSACTION_INPROGRESS',
    TRANSACTION_COMPLETE: 'METAMASK_TRANSACTION_COMPLETE',
    CONNECT_TO_METAMASK: 'CONNECT_TO_METAMASK',
    METAMASK_VALUE:'METAMASK_VALUE'
}

export const metaMaskConnected = () => (dispatch) => {
    return dispatch({ type: metaMaskActionTypes.METAMASK_CONNECTED })
}

export const metaMaskDisconnected = () => (dispatch) => {
    return dispatch({ type: metaMaskActionTypes.METAMASK_DISCONNECTED })
}

export const metaMaskTransactionInProgress = () => (dispatch) => {
    return dispatch({ type: metaMaskActionTypes.TRANSACTION_INPROGRESS })
}

export const metaMaskTransactionComplete = () => (dispatch) => {
    return dispatch({ type: metaMaskActionTypes.TRANSACTION_COMPLETE })
}

export const connectToMeta = (meta) => (dispatch) => {
    return dispatch({ type: metaMaskActionTypes.CONNECT_TO_METAMASK,publickey: meta.publickey, metaConn:meta.metaConn, web3contract:meta.web3contract, walletname:meta.walletname})
}

export const metaMaskValue = () => (dispatch) => {
    return dispatch({ type: metaMaskActionTypes.METAMASK_VALUE })
}