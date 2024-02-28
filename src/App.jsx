import React, { useState } from "react"

import { createTheme, ThemeProvider } from "@mui/material/styles"

import { Toaster } from "react-hot-toast"

import Body from "@components/Body/Body"

function App() {
  const [sidebarSize, setSidebarSize] = useState(localStorage.getItem("sidebarSize") || "large")

  const toggleSidebarSize = () => {
    const newSize = sidebarSize === "large" ? "small" : "large"
    setSidebarSize(newSize)
    localStorage.setItem("sidebarSize", newSize)
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(88, 101, 242)"
      },
      error: {
        main: "#d32f2f"
      }
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
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
            }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: ".775rem",
            color: "var(--outline)",
            fontWeight: 550
          },
          shrink: {
            fontSize: "1rem"
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
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
            padding: "16px"
          }
        }}
      />
    </ThemeProvider>
  )
}

export default App
