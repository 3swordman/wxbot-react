import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import NavBar from "./Navbar"

import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Verify from "./pages/Verify"

import { setUsernameToken } from "./state/auth"
import { useAppDispatch, restoreData } from "./store"

export default function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    (async () => {
      const { username, token } = await restoreData()
      if (username == null || token == null) {
        return
      }
      dispatch(setUsernameToken({
        username, token
      } as any))
    })()
  }, [])
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  )  
}
