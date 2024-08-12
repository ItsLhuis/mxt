import PropTypes from "prop-types"

import { useEffect } from "react"
import ReactDOM from "react-dom"

const Portal = ({ children }) => {
  const createPortalRoot = (id) => {
    const newPortalRoot = document.createElement("div")
    newPortalRoot.id = id
    newPortalRoot.setAttribute("aria-hidden", "true")

    document.body.appendChild(newPortalRoot)

    return newPortalRoot
  }

  const portalRootId = "portal-root"
  const portalRoot = document.getElementById(portalRootId) || createPortalRoot(portalRootId)

  useEffect(() => {
    return () => {
      if (portalRoot && document.body.contains(portalRoot)) {
        document.body.removeChild(portalRoot)
      }
    }
  }, [portalRoot])

  return ReactDOM.createPortal(children, portalRoot)
}

Portal.propTypes = {
  children: PropTypes.node.isRequired
}

export default Portal
