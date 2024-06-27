import { lazy } from "react"

const CompanyLogoForm = lazy(() => import("./CompanyLogoForm"))
const CompanyDataForm = lazy(() => import("./CompanyDataForm"))

export { CompanyLogoForm, CompanyDataForm }
