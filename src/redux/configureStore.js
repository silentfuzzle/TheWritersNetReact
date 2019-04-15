import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Books } from './booksReducer';
import { Permissions } from './permissionsReducer';
import { PTypes } from './permissionTypesReducer';
import { Reviews } from './reviewsReducer';
import { Users } from './usersReducer';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            books: Books,
            permissions: Permissions,
            permissionTypes: PTypes,
            reviews: Reviews,
            users: Users
        }),
        applyMiddleware(thunk)
    );

    return store;
}