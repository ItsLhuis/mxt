import React, { useState, useEffect } from "react"

import { Stack } from "@mui/material"

import { Load, PageProgress } from ".."

import { motion } from "framer-motion"

const Loader = ({ visible }) => {
  const [isDismounting, setIsDismounting] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!visible) {
      const timeoutId = setTimeout(() => {
        setIsExiting(true)
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setIsDismounting(false)
      setIsExiting(false)
    }
  }, [visible])

  useEffect(() => {
    if (isExiting) {
      const timeoutId = setTimeout(() => {
        setIsDismounting(true)
      }, 200)

      return () => clearTimeout(timeoutId)
    }
  }, [isExiting])

  return (
    !isDismounting && (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: !isExiting ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          zIndex: 9999,
          backgroundColor: "var(--background)",
          pointerEvents: !isExiting ? "auto" : "none",
          overflow: "hidden"
        }}
      >
        <Stack
          sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <PageProgress />
          <Load />
        </Stack>
      </motion.div>
    )
  )
}

export default Loader
