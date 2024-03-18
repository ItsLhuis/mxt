import { lazy } from "react"

const AnnualActivities = lazy(() => import("./AnnualActivities/AnnualActivities"))
const FinancialStatistics = lazy(() => import("./FinancialStatistics/FinancialStatistics"))
const Summary = lazy(() => import("./Summary/Summary"))
const ReparationsStates = lazy(() => import("./ReparationsStates/ReparationsStates"))

export { AnnualActivities, FinancialStatistics, Summary, ReparationsStates }
