import { lazy } from "react"

const EmployeeRoleForm = lazy(() => import("./EmployeeRoleForm"))
const EmployeeStatusForm = lazy(() => import("./EmployeeStatusForm"))

export { EmployeeRoleForm, EmployeeStatusForm }
