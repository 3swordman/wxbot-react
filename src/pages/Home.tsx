import { useEffect } from "react"

import { addGoods, clearGoods } from "../state/goods"
import { getGoods } from "../network"
import { useAppDispatch, useAppSelector } from "../store"
import { Goods } from "../Goods"

function Home() {
  const dispatch = useAppDispatch()
  const goodsValue = useAppSelector(state => state.goods.value)
  useEffect(() => {
    setTimeout(() => {
      // why fucking useless clearGoods? because the strict mode of react will render the component twice. 
      if (!goodsValue.length) {
        dispatch(clearGoods())
        dispatch(addGoods(getGoods()))
      }
    }, 0)
  }, [])
  return (
    <>
      <Goods></Goods>
    </>
  )
}

export default Home
