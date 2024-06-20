import PropTypes from "prop-types"

import React from "react"

import { motion } from "framer-motion"

const Loadable = ({ isLoading, LoadingComponent, LoadedComponent }) => {
  return isLoading ? (
    LoadingComponent
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {LoadedComponent}
    </motion.div>
  )
}

Loadable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  LoadingComponent: PropTypes.node.isRequired,
  LoadedComponent: PropTypes.node.isRequired
}

export default Loadable
