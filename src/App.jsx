import React, { useState } from "react"

import Body from "@components/Body/Body"

import { ToastContainer } from "react-toastify"

function App() {
  const [sidebarSize, setSidebarSize] = useState("large")

  const toggleSidebarSize = () => {
    setSidebarSize(sidebarSize === "large" ? "small" : "large")
  }

  const [sidebarSizeMobile, setSidebarSizeMobile] = useState("close")

  const toggleSidebarSizeMobile = () => {
    setSidebarSizeMobile(sidebarSizeMobile === "close" ? "open" : "close")
  }

  return (
    <>
      <div className="app">
        <div className="container-main">
          <Body
            toggleSidebarSize={toggleSidebarSize}
            sidebarSize={sidebarSize}
            toggleSidebarSizeMobile={toggleSidebarSizeMobile}
            sidebarSizeMobile={sidebarSizeMobile}
            setSidebarSizeMobile={setSidebarSizeMobile}
          />
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App
