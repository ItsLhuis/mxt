import React from "react"

import "./styles.css"

import { motion } from "framer-motion"

const Rings = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        scale: [1, 2, 2, 3, 1],
        opacity: [1, 0.1, 0.2, 0.4, 0.8, 0.1, 1],
        borderRadius: ["20%", "20%", "50%", "80%", "20%"]
      }}
      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
      className="rings"
    >
      <div className="circle-ring _1" />
      <div className="circle-ring _2" />
      <div className="circle-ring _3" />
      <div className="circle-ring _4" />
      <div className="circle-ring _5" />
    </motion.div>
  )
}

export default Rings
