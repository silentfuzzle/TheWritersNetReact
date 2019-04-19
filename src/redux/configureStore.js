import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Books } from './booksReducer';
import { OpenedBooks } from './openedBooksReducer';
import { Pages } from './pagesReducer';
import { Permissions } from './permissionsReducer';
import { PTypes } from './permissionTypesReducer';
import { Reviews } from './reviewsReducer';
import { Users } from './usersReducer';
import { Login } from './loginReducer';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            books: Books,
            openedBooks: OpenedBooks,
            pages: Pages,
            permissions: Permissions,
            permissionTypes: PTypes,
            reviews: Reviews,
            users: Users,
            login: Login
        }),
        applyMiddleware(thunk)
    );

    return store;
}