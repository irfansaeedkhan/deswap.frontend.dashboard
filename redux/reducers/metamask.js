import {metaMaskActionTypes} from '../actions/metamask';

const metamaskConnectionReducer = (state = {value: 0,
    metamaskaccount:"",
    metaconn:null,
    metamaskconnected:false,
    transactionProgress:false,
    web3contract:null,
    walletname:"metamask",
}, action) => {
    switch (action.type) {
        case metaMaskActionTypes.METAMASK_CONNECTED:
            return {...state, metamaskconnected: true};
        case metaMaskActionTypes.METAMASK_DISCONNECTED:
            return {...state, metamaskconnected: false, metaconn:null,metamaskaccount:"",transactionProgress:false,web3contract:null,walletname:""};
        case metaMaskActionTypes.TRANSACTION_INPROGRESS:
            return {...state, transactionProgress:true};
        case metaMaskActionTypes.TRANSACTION_COMPLETE:
            return {...state, transactionProgress:false};
        case metaMaskActionTypes.CONNECT_TO_METAMASK:
            return {...state, metaconn: action.metaConn, metamaskaccount:action.publickey,metamaskconnected:true,transactionProgress:false, web3contract:action.web3contract,walletname:action.walletname};
        case metaMaskActionTypes.METAMASK_VALUE:
            return {...state, test:"Testing"};
        default:
            return {...state, test:"Default"};
    }
};

export default metamaskConnectionReducer;