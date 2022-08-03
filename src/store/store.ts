import { configureStore } from '@reduxjs/toolkit'
import domainsReducer from '@store/slices/domainsSlice'
import globalsReducer from "@store/slices/globalsSlice"
import authReducer from '@store/slices/authSlice'
import errorsReducer from "@store/slices/errorsSlice"
import serversReducer from "@store/slices/serversSlice"
import providersReducer from "@store/slices/providersSlice"
import emailsReducer from "@store/slices/emailsSlice"
import registratorsReducer from "@store/slices/registratorsSlice"
//import { authApi } from "@store/services/authApi"

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
    auth: authReducer,
    //    [authApi.reducerPath]: authApi.reducer,
    domains: domainsReducer,
    servers: serversReducer,
    emails: emailsReducer,
    providers: providersReducer,
    errors: errorsReducer,
    registrators: registratorsReducer,
  },
  //  middleware: (gDM) => gDM().concat(authApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch