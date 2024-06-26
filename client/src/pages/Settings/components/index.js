import { lazy } from "react"

const Account = lazy(() => import("./Account"))
const AppSettings = lazy(() => import("./AppSettings"))
const Company = lazy(() => import("./Company"))
const Security = lazy(() => import("./Security"))
const Server = lazy(() => import("./Server"))

export { Account, AppSettings, Company, Security, Server }
