import { lazy } from "react"

const RepairInterventionWorkDoneTable = lazy(() => import("./RepairInterventionWorkDoneTable"))
const RepairInterventionWorkDoneAddModal = lazy(() => import("./RepairInterventionWorkDoneAddModal"))
const RepairInterventionWorkDoneEditModal = lazy(() => import("./RepairInterventionWorkDoneEditModal"))

export { RepairInterventionWorkDoneTable, RepairInterventionWorkDoneAddModal, RepairInterventionWorkDoneEditModal }
