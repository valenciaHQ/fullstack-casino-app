import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import userSlice from './reducer/userSlice'
import gameSlice from './reducer/gameSlice'

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        game: gameSlice.reducer
    },
})

export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

export default store