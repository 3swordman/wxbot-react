import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { Good } from "../constants"

interface GoodsState {
  value: Good[]
}

const initialState: GoodsState = {
  value: []
}

export const goodsSlice = createSlice({
  name: "goods",
  initialState,
  reducers: {
    addGoods(state: GoodsState, payload: PayloadAction<Good[]>) {
      // [].push.apply(state.value, payload.payload)
      state.value.push(...payload.payload)
    },
    clearGoods(state: GoodsState) {
      state.value = []
    }
  }
})

export const { addGoods, clearGoods } = goodsSlice.actions

export default goodsSlice.reducer
