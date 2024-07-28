import { lazy } from "react"

const Summary = lazy(() => import("./Summary/Summary"))
const Equipment= lazy(() => import("./Equipment/Equipament"))
const AnnualActivities = lazy(() => import("./AnnualActivities"))
const FinancialStatistics = lazy(() => import("./FinancialStatistics"))
const ReparationsStates = lazy(() => import("./ReparationsStates"))

export { Summary, Equipment, AnnualActivities, FinancialStatistics, ReparationsStates }
