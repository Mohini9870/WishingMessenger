import { configureStore } from '@reduxjs/toolkit'
import wishReducer from './wishSlice';
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    wishes: wishReducer,
    auth : authReducer,
  }
})

 export type RootState = ReturnType<typeof store.getState>
 export type AppDispatch = typeof store.dispatch
