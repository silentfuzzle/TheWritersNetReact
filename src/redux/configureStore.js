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
import { Sections } from './sectionsReducer';
import { PageSections } from './pageSectionsReducer';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            books: Books,
            openedBooks: OpenedBooks,
            pages: Pages,
            sections: Sections,
            pageSections: PageSections,
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