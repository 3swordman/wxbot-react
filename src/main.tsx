import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import NavBar from "./Navbar"
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from "@mui/material/styles"

import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Verify from "./pages/Verify"
import store from "./store"

const GlobalStyle = createGlobalStyle`
  html {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
  }
  body {
    margin: 0;
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
`

const theme = createTheme()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
