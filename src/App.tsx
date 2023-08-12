import { useEffect, lazy, Suspense, useState } from "react"
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import styled from "styled-components"

import { Backdrop, CircularProgress } from "@mui/material"

import NavbarContainer from "./Navbar"

// import Home from "./pages/Home"
// import Checkout from "./pages/Checkout"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Verify from "./pages/Verify"

const Home = lazy(() => import("./pages/Home"))
const Checkout = lazy(() => import("./pages/Checkout"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const Verify = lazy(() => import("./pages/Verify"))
const Sell = lazy(() => import("./pages/Sell"))

import { setUsernameToken } from "./state/auth"
import { useAppDispatch, restoreData } from "./store"

const LoadingBackdrop = styled(Backdrop)`
  color: white;
`

function Loading() {
  return (
    <LoadingBackdrop open={true}>
      <CircularProgress color="inherit" />
    </LoadingBackdrop>
  )
}

function LoadingWithDelay() {
  const delay = 200
  const [shouldShowLoading, setShouldShowLoading] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShouldShowLoading(true), delay)
    return () => clearTimeout(timer)
  }, [])

  return shouldShowLoading ? <Loading /> : null
}

const routerObject = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<NavbarContainer />}>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/sell" element={<Sell />} />
      </Route>
    </>
  )
)

export default function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    ;(async () => {
      const { username, token } = await restoreData()
      if (username == null || token == null) {
        return
      }
      dispatch(
        setUsernameToken({
          username,
          token
        })
      )
    })()
  }, [])
  return (
    <>
      <Suspense fallback={<LoadingWithDelay />}>
        <RouterProvider router={routerObject} />
      </Suspense>
    </>
  )
}
