import { lazy } from "react"

const AddEmployeeForm = lazy(() => import("./Add/AddEmployeeForm"))
const EditEmployee = lazy(() => import("./Edit/EditEmployee"))

export { AddEmployeeForm, EditEmployee }
