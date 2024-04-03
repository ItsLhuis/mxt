import React, { useState } from "react"

import { useLocation } from "react-router-dom"

import { useLoader } from "@contexts/loaderContext"

import { useTheme } from "@contexts/themeContext"

import { createTheme, ThemeProvider } from "@mui/material/styles"

import { Toaster } from "react-hot-toast"

import Body from "@components/Body/Body"
import { Auth } from "@pages"

import { Loader } from "@components/ui"

import { AnimatePresence } from "framer-motion"

function App() {
  const location = useLocation()

  const { loader } = useLoader()

  const { dataTheme } = useTheme()

  const [sidebarSize, setSidebarSize] = useState(localStorage.getItem("sidebarSize") || "large")

  const toggleSidebarSize = () => {
    const newSize = sidebarSize === "large" ? "small" : "large"
    setSidebarSize(newSize)
    localStorage.setItem("sidebarSize", newSize)
  }

  const secondaryButtonBackgroundColor =
    dataTheme === "dark" ? "rgb(68, 69, 89)" : "rgb(225, 224, 249)"

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
            },
            "&.Mui-disabled": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--elevation-level5)"
              },
              "& .MuiInputBase-input": {
                WebkitTextFillColor: "var(--outline)",
                cursor: "not-allowed"
              }
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
            fontWeight: 550
          },
          shrink: {
            fontSize: "1rem"
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "var(--onSurface)"
          }
        }
      }
    }
  })

  return (
    <AnimatePresence>
      <ThemeProvider theme={theme}>
        <>
          <Loader visible={loader} />
          {location.pathname.includes("/auth") ? (
            <Auth />
          ) : (
            <>
              <div className="app">
                <div className="container-main">
                  <Body toggleSidebarSize={toggleSidebarSize} sidebarSize={sidebarSize} />
                </div>
              </div>
              <Toaster
                position="top-right"
                containerStyle={{
                  inset: "24px"
                }}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "var(--elevation-level5)",
                    color: "var(--onSurface)",
                    fontWeight: 600,
                    fontSize: ".875rem",
                    padding: 0,
                    paddingLeft: 20,
                    paddingBlock: 8
                  }
                }}
              />
            </>
          )}
        </>
      </ThemeProvider>
    </AnimatePresence>
  )
}

export default App
