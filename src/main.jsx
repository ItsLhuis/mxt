import React from "react"
import ReactDOM from "react-dom/client"

import { ThemeProvider } from "@contexts/themeContext"

import { BrowserRouter } from "react-router-dom"

import App from "./App.jsx"

import "./index.css"
import "./themes.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
