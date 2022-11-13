import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import localforage from "localforage"

import currentGoodsReducer from "./state/current-goods"
import goodsReducer from "./state/goods"
import authReducer from "./state/auth"

const store = configureStore({
  reducer: {
    currentGoods: currentGoodsReducer,
    goods: goodsReducer,
    auth: authReducer
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export async function saveData({ username, token }: {
  username: string,
  token: string
}) {
  await localforage.setItem("username", username)
  await localforage.setItem("token", token)
}

export async function restoreData() {
  const username = await localforage.getItem<string>("username")
  const token = await localforage.getItem<string>("token")
  return { username, token }
}

export async function clearData() {
  await localforage.removeItem("username")
  await localforage.removeItem("token")
}