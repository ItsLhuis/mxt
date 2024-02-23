import { lazy } from "react"

const Dashboard = lazy(() => import("./Dashboard/Dashboard"))
const Settings = lazy(() => import("./Settings/Settings"))

export { Dashboard, Settings }
