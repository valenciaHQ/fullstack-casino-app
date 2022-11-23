import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { rules } from '../utils'

// Define a type for the slice state
export interface GameState {
    reels: Fruit[][],
    gameResults: GameResult[],
    lastResult: number
}

// Define the initial state using that type
const initialState: GameState = {
    reels: [["cherry", "lemon", "apple", "lemon", "banana", "banana", "lemon", "lemon"], ["lemon", "apple", "lemon", "lemon", "cherry", "apple", "banana", "lemon"], ["lemon", "apple", "lemon", "apple", "cherry", "lemon", "banana", "lemon"]],
    gameResults: [],
    lastResult: 0
}

export const gameSlice = createSlice({
    name: 'game',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setGameResult: (state, action: PayloadAction<GameResult>) => {
            state.gameResults.push(action.payload)
            state.lastResult = action.payload.hits.map((hit: Gamehit) => rules[hit]).reduce((prev, curr) => prev + curr)
        },
    },
})

export const { setGameResult } = gameSlice.actions
export default gameSlice