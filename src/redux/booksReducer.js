import { BOOKS } from '../temp/books.js';

export const BOOKS_FETCH = "BOOKS_FETCH";
export const BOOKS_LOADING = "BOOKS_LOADING";
export const BOOKS_FAILED = "BOOKS_FAILED";
export const BOOKS_DISPLAY = "BOOKS_DISPLAY";

export const fetchBooks = () => (dispatch) => {
    dispatch(booksLoading());

    setTimeout(() => {
        dispatch(displayBooks(BOOKS))
    }, 2000);
};

export const booksLoading = () => ({
    type: BOOKS_LOADING
});

export const booksFailed = (errmess) => ({
    type: BOOKS_FAILED,
    payload: errmess
});

export const displayBooks = (books) => ({
    type: BOOKS_DISPLAY,
    payload: books
})

export const Books = (state = {
        isLoading: true,
        errMess: null,
        books: BOOKS
    }, action) => {
    
    switch(action.type) {
        case BOOKS_DISPLAY:
            return { ...state, isLoading: false, errMess: null, books: action.payload };

        case BOOKS_LOADING:
            return { ...state, isLoading: true, errMess: null };

        case BOOKS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, books: [] };

        default:
            return state;
    }
};