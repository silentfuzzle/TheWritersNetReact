const LOGIN_LOADING = 'LOGIN_LOADING';
const ADD_LOGIN = 'ADD_LOGIN';
const LOGIN_FAILED = 'LOGIN_FAILED';

export const postLogin = (username, password) => (dispatch) => {
    // This would query the database for the given username and password
    dispatch(loginLoading());

    setTimeout(() => {
        const testUser = {
            id: 1,
            username: 'rawbertgates',
            displayname: 'Robert Gates',
            email: 'robert.gates@example.com',
            hashedpassword: 'abcdefg123456'
        };
    
        if (testUser.username === username && testUser.password === password) {
            dispatch(addLogin({
                id: 1,
                username: username,
                displayname: testUser.displayname
            }));
        } else {
            dispatch(loginFailed('User not found.'));
        }
    }, 2000);
};

export const postLogout = () => (dispatch) => {
    dispatch(addLogin(null));
}

export const postSignup = (user) => (dispatch) => {
    // This would query the database
    dispatch(loginLoading());

    setTimeout(() => {
        const testUser = {
            id: 1,
            username: 'rawbertgates',
            displayname: 'Robert Gates',
            email: 'robert.gates@example.com',
            hashedpassword: 'abcdefg123456'
        };
    
        if (testUser.username === user.username) {
            dispatch(loginFailed('A user with that username already exists.'));
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