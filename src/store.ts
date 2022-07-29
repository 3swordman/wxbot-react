import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import currentGoodsReducer from "./state/current-goods"
import goodsReducer from "./state/goods"

const store = configureStore({
  reducer: {
    currentGoods: currentGoodsReducer,
    goods: goodsReducer
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector