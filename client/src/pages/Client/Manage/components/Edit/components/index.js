import { lazy } from "react"

const ClientDetailsForm = lazy(() => import("./ClientDetailsForm"))
const ClientContact = lazy(() => import("./ClientContact"))

export { ClientDetailsForm, ClientContact }
