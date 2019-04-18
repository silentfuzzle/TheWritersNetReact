const LOGIN_LOADING = 'LOGIN_LOADING';
const ADD_LOGIN = 'ADD_LOGIN';
const LOGIN_FAILED = 'LOGIN_FAILED';

export const postSignup = (user) => (dispatch) => {
    // This would query the database
    dispatch(loginLoading());

    setTimeout(() => {
        if ('failsignup' === user.username) {
            dispatch(loginFailed('An internal server error occurred.'));
        } else {
            dispatch(addLogin({
                id: 6,
                username: user.username,
                displayname: user.username
            }));
        }
    }, 2000);
}

export const loginLoading = () => ({
    type: LOGIN_LOADING
});

export const loginFailed = (errmess) => ({
    type: LOGIN_FAILED,
    payload: errmess
});

export const addLogin = (user) => ({
    type: ADD_LOGIN,
    payload: user
});

export const Login = (state = {
    user: null,
    isLoading: false,
    errMess: ''
}, action) => {
    switch (action.type) {
        case ADD_LOGIN:
            return { ...state, isLoading: false, errMess: null, user: action.payload };

        case LOGIN_LOADING:
            return { ...state, isLoading: true, errMess: null, user: null };

        case LOGIN_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, user: null };

        default:
          return state;
      }
};