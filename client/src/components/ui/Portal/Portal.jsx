import PropTypes from "prop-types"

import { useEffect, useRef } from "react"
import ReactDOM from "react-dom"

import { v4 as uuidv4 } from "uuid"

const Portal = ({ children, portalId, style }) => {
  const portalRootRef = useRef(null)

  useEffect(() => {
    const id = portalId || uuidv4()
    let portalRoot = document.getElementById(id)

    if (!portalRoot) {
      portalRoot = document.createElement("div")
      portalRoot.id = id

      portalRoot.setAttribute("aria-hidden", "true")

      portalRoot.style.position = "fixed"
      portalRoot.style.top = "0"
      portalRoot.style.left = "0"
      portalRoot.style.width = "100%"
      portalRoot.style.height = "100%"
      portalRoot.style.zIndex = "4999"
      Object.assign(portalRoot.style, style)

      document.body.appendChild(portalRoot)
    }

    portalRootRef.current = portalRoot

    return () => {
      if (portalRoot && document.body.contains(portalRoot)) {
        document.body.removeChild(portalRoot)
      }
    }
  }, [portalId])

  return portalRootRef.current ? ReactDOM.createPortal(children, portalRootRef.current) : null
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  portalId: PropTypes.string,
  style: PropTypes.object
}

export default Portal
