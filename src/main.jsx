import React from "react"
import ReactDOM from "react-dom/client"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"

import { ThemeProvider } from "@contexts/themeContext"
import { LoaderProvider } from "@contexts/loaderContext"
import { pt } from "date-fns/locale/pt"

import { BrowserRouter } from "react-router-dom"

import App from "./App.jsx"

import "./index.css"
import "./themes.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={pt}
      localeText={{
        cancelButtonLabel: "Cancelar",
        okButtonLabel: "Selecionar",
        datePickerToolbarTitle: "Selecione uma data"
      }}
    >
      <ThemeProvider>
        <LoaderProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LoaderProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
)
