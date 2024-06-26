import React, { useState } from "react"

import { useLocation } from "react-router-dom"

import { useAuth } from "@contexts/auth"
import { useLoader } from "@contexts/loader"
import { useTheme } from "@contexts/theme"

import { createTheme, ThemeProvider } from "@mui/material/styles"

import { Toaster } from "react-hot-toast"

import { NotFound } from "@components/ui"
import { Body } from "@components"
import { Auth, Company } from "@pages"

import { Loader } from "@components/ui"

import { AnimatePresence } from "framer-motion"

function App() {
  const location = useLocation()

  const { isAuth, isAuthCompany, isLoading } = useAuth()
  const { loader } = useLoader()
  const { dataTheme } = useTheme()

  const [sidebarSize, setSidebarSize] = useState(localStorage.getItem("sidebarSize") || "large")

  const toggleSidebarSize = () => {
    const newSize = sidebarSize === "large" ? "small" : "large"
    setSidebarSize(newSize)
    localStorage.setItem("sidebarSize", newSize)
  }

  const secondaryButtonBackgroundColor =
    dataTheme === "dark" ? "rgb(45, 45, 56)" : "rgb(235, 232, 248)"

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(88, 101, 242)"
      },
      secondary: {
        main: secondaryButtonBackgroundColor
      },
      error: {
        main: "rgb(211, 47, 47)"
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            color: "color: rgb(228, 225, 230)"
          },
          textError: {
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.16)"
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "var(--onSurface)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "2px solid var(--elevation-level5)"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--outline)"
            },
            "&.Mui-disabled": {
              "& .MuiOutlinedInput-notchedOutline": {
                border: "2px solid var(--elevation-level5)"
              },
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "var(--outline)",
                cursor: "not-allowed"
              }
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid var(--primary)"
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              border: "2px solid #d32f2f"
            },
            "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d32f2f"
            },
            "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid #d32f2f"
            }
          },
          shrink: {
            fontSize: "13px"
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "13px",
            color: "var(--outline)",
            fontWeight: 400
          },
          shrink: {
            fontSize: "1rem",
            fontWeight: 550
          }
        }
      }
    }
  })

  const renderApp = () => {
    if (isAuthCompany) {
      return <Company />
    }

    if (!isAuth) {
      return <Auth />
    }

    if (location.pathname === "/404") {
      return <NotFound />
    }

    return (
      <div className="app">
        <div className="container-main">
          <Body toggleSidebarSize={toggleSidebarSize} sidebarSize={sidebarSize} />
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <ThemeProvider theme={theme}>
        <Loader visible={loader} />
        {!isLoading && <> {renderApp()} </>}
        <Toaster
          position="top-right"
          containerStyle={{
            zIndex: 1000,
            inset: "24px"
          }}
          toastOptions={{
            duration: 4000,
            style: {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              background: "var(--elevation-level5)",
              color: "var(--onSurface)",
              fontWeight: 600,
              fontSize: ".875rem",
              padding: 0,
              paddingLeft: 16,
              paddingBlock: 16
            }
          }}
        />
      </ThemeProvider>
    </AnimatePresence>
  )
}

export default App
