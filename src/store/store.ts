import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice'
import tastReducer from './task/taskSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        task: tastReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch