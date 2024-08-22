import { lazy } from "react"

const AnnualActivities = lazy(() => import("./AnnualActivities/AnnualActivities"))
const Equipment = lazy(() => import("./Equipment/Equipament"))
const Repair = lazy(() => import("./Repair/Repair"))
const Summary = lazy(() => import("./Summary/Summary"))

export { Equipment, Repair, AnnualActivities, Summary }
