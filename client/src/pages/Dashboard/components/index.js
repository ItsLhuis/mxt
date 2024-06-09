import { lazy } from "react"

const AnnualActivities = lazy(() => import("./AnnualActivities"))
const FinancialStatistics = lazy(() => import("./FinancialStatistics"))
const Summary = lazy(() => import("./Summary/Summary"))
const ReparationsStates = lazy(() => import("./ReparationsStates"))

export { AnnualActivities, FinancialStatistics, Summary, ReparationsStates }
