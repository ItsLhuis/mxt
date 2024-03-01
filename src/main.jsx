import React from "react"
import ReactDOM from "react-dom/client"

import { ThemeProvider } from "@contexts/themeContext"
import { LoaderProvider } from "@contexts/loaderContext"

import { BrowserRouter } from "react-router-dom"

import App from "./App.jsx"

import "./index.css"
import "./themes.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <LoaderProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LoaderProvider>
    </ThemeProvider>
  </React.StrictMode>
)
