import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface UserState {
    authUser: User | null
}

// Define the initial state using that type
const initialState: UserState = {
    authUser: null,
}

export const userSlice = createSlice({
    name: 'userSlice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ user: User | null }>) => {
            state.authUser = action.payload.user
        },
        setCoins: (state, action: PayloadAction<number>) => {
            if (state.authUser) {
                state.authUser.coins = action.payload
            }
        },
    },
})

export const { setAuth, setCoins } = userSlice.actions
export default userSlice