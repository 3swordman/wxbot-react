import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from "@mui/material/styles"

import store from "./store"
import "./i18n"

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
if (navigator.serviceWorker && import.meta.env.PROD) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(function () {
      console.log("registered successfully")
    })
}

const theme = createTheme()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <GlobalStyle />
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </StyledEngineProvider>
        </ThemeProvider>
      </Provider>
  </StrictMode>
)
