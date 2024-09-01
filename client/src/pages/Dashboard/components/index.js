import { lazy } from "react"

const AnnualActivities = lazy(() => import("./AnnualActivities/AnnualActivities"))
const Client = lazy(() => import("./Client/Client"))
const Equipment = lazy(() => import("./Equipment/Equipament"))
const Repair = lazy(() => import("./Repair/Repair"))
const Summary = lazy(() => import("./Summary/Summary"))

export { AnnualActivities, Client, Equipment, Repair, Summary }
