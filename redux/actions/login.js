export const userLoginActionTypes = {
    USER_LOGGEDIN: 'USER_LOGGEDIN',
    USER_LOGGEDOUT: 'USER_LOGGEDOUT',
    USER_INFO: 'USER_INFO'
}

export const userLoggedIn = (user) => (dispatch) => {
    return dispatch({ type: userLoginActionTypes.USER_LOGGEDIN ,user})
}

export const userLoggedOut = () => (dispatch) => {
    return dispatch({ type: userLoginActionTypes.USER_LOGGEDOUT })
}

export const userInfo = () => (dispatch) => {
    return dispatch({ type: userLoginActionTypes.USER_INFO })
}