import PropTypes from "prop-types"

import { useEffect } from "react"
import ReactDOM from "react-dom"

const Portal = ({ children, style }) => {
  const createPortalRoot = (id) => {
    const newPortalRoot = document.createElement("div")
    newPortalRoot.id = id

    newPortalRoot.setAttribute("aria-hidden", "true")

    newPortalRoot.style.position = "fixed"
    newPortalRoot.style.top = "0"
    newPortalRoot.style.left = "0"
    newPortalRoot.style.width = "100%"
    newPortalRoot.style.height = "100%"
    newPortalRoot.style.zIndex = "4999"

    Object.assign(newPortalRoot.style, style)

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
