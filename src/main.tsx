import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { Provider } from "react-redux"
import { createGlobalStyle } from "styled-components"
import { ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles"
import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "./network"
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
if (navigator.serviceWorker && import.meta.env.PROD && Math.random() > 100) {
  navigator.serviceWorker.register("./sw.js").then(function () {
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
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
