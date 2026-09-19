import {userLoginActionTypes} from '../actions/login';

const loginReducer = (state = {loggedIn: false}, action) => {
    switch (action.type) {
        case userLoginActionTypes.USER_LOGGEDIN:
            return {...state, loggedIn:true, email:action.emailid, userid:action.uuid, accountverified:action.verified,user:action.user};
        case userLoginActionTypes.USER_LOGGEDOUT:
            return {...state, loggedIn:false, email:"", userid:"", accountverified:false,user:false};
        default:
            return {...state};
    }
};

export default loginReducer;
