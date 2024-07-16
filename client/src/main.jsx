import React from "react"
import ReactDOM from "react-dom/client"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { pt } from "date-fns/locale/pt"

import { AuthProvider } from "@contexts/auth.jsx"
import { LoaderProvider } from "@contexts/loader.jsx"
import { ThemeProvider } from "@contexts/theme.jsx"

import { BrowserRouter } from "react-router-dom"

import { enableMapSet } from "immer"
enableMapSet()

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
    }
  }
})

import App from "./App.jsx"

import "./index.css"
import "./themes.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={pt}
      localeText={{
        dateTimePickerToolbarTitle: "Selecione uma data",
        cancelButtonLabel: "Cancelar",
        okButtonLabel: "Selecionar",
        datePickerToolbarTitle: "Selecione uma data"
      }}
    >
      <BrowserRouter>
        <ThemeProvider>
          <LoaderProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <App />
                <ReactQueryDevtools initialIsOpen={false} position="bottom" />
              </AuthProvider>
            </QueryClientProvider>
          </LoaderProvider>
        </ThemeProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </React.StrictMode>
)
