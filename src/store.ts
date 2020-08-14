import { configureStore, createAction, createReducer } from '@reduxjs/toolkit'
import { useSelector as baseUseSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

type RootState = Readonly<{ playing: boolean }>
const initialState: RootState = { playing: false }

export const play = createAction('play')

const reducer = createReducer(initialState, {
  [play.type]: state => {
    state.playing = true
  }
})

export const store = configureStore({ reducer })

export const useSelector: TypedUseSelectorHook<RootState> = baseUseSelector
