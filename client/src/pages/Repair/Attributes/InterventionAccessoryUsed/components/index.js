import { lazy } from "react"

const RepairInterventionAccessoryUsedTable = lazy(() =>
  import("./RepairInterventionAccessoryUsedTable")
)
const RepairInterventionAccessoryUsedAddModal = lazy(() =>
  import("./RepairInterventionAccessoryUsedAddModal")
)
const RepairInterventionAccessoryUsedEditModal = lazy(() =>
  import("./RepairInterventionAccessoryUsedEditModal")
)

export {
  RepairInterventionAccessoryUsedTable,
  RepairInterventionAccessoryUsedAddModal,
  RepairInterventionAccessoryUsedEditModal
}
