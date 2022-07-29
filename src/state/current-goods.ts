import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { Good } from "../constants"

interface GoodsState {
  value: [Good, number][]
}

const initialState: GoodsState = {
  value: []
}

function deepEquals(good1: Good, good2: Good) {
  // only for Good
  return JSON.stringify(good1) == JSON.stringify(good2)
}

export const currentGoodsSlice = createSlice({
  name: "current-goods",
  initialState,
  reducers: {
    addGoods(state: GoodsState, payload: PayloadAction<{
      good: Good,
      count: number
    }>) {
      const { good, count } = payload.payload
      const value = state.value
      const existedValue = value.find(function ([good2, count]) {
        return deepEquals(good, good2)
      })
      if (existedValue === undefined) {
        value.push([good, count])
      } else {
        existedValue[1] += count
      }
    },
    setGoods(state: GoodsState, payload: PayloadAction<{
      good: Good,
      count: number
    }>) {
      const { good, count } = payload.payload
      const value = state.value
      const existedValue = value.find(function ([good2, count]) {
        return deepEquals(good, good2)
      })
      if (existedValue === undefined) {
        console.error("something bad happened", { good, count, value, existedValue })
      } else {
        existedValue[1] = count
      }

    }
  }
})

export const { addGoods, setGoods } = currentGoodsSlice.actions

export default currentGoodsSlice.reducer