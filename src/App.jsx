import React, { useState } from "react"

import Body from "@components/Body/Body"

import { ToastContainer } from "react-toastify"

function App() {
  const [sidebarSize, setSidebarSize] = useState(localStorage.getItem("sidebarSize") || "large")

  const toggleSidebarSize = () => {
    const newSize = sidebarSize === "large" ? "small" : "large"
    setSidebarSize(newSize)
    localStorage.setItem("sidebarSize", newSize)
  }

  return (
    <>
      <div className="app">
        <div className="container-main">
          <Body toggleSidebarSize={toggleSidebarSize} sidebarSize={sidebarSize} />
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App
