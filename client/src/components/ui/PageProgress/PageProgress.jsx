import { LinearProgress } from "@mui/material"

const PageProgress = () => {
  return (
    <div
      style={{
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999
      }}
    >
      <LinearProgress style={{ backgroundColor: "transparent", height: 3 }} />
    </div>
  )
}

export default PageProgress
