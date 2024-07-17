import { lazy } from "react"

const AddRepairForm = lazy(() => import("./Add/AddRepairForm"))
const EditRepair = lazy(() => import("./Edit/EditRepair"))

export { AddRepairForm, EditRepair }
