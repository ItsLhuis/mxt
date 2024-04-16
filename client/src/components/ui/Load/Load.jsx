import React from "react"

import "./styles.css"

import { Box } from "@mui/material"

import { motion } from "framer-motion"

const Load = () => {
  return (
    <Box
      sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <motion.div
        className="box _1"
        animate={{ rotate: 180 }}
        transition={{ repeat: Infinity, duration: 0.8, delay: 0.1, type: "spring" }}
      />
      <motion.div
        className="box _2"
        animate={{ rotate: 180 }}
        transition={{ repeat: Infinity, duration: 0.8, type: "tween" }}
      />
      <motion.div
        className="box _3"
        animate={{ rotate: 180 }}
        transition={{ repeat: Infinity, duration: 0.8, delay: 0.1, type: "tween" }}
      />
    </Box>
  )
}

export default Load
