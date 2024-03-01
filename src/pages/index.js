import { lazy } from "react"

import Auth from "./Auth/Auth"

const Dashboard = lazy(() => import("./Dashboard/Dashboard"))
const Settings = lazy(() => import("./Settings/Settings"))

export { Auth, Dashboard, Settings }
