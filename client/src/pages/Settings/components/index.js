import { lazy } from "react"

const Account = lazy(() => import("./Account"))
const AppSettings = lazy(() => import("./AppSettings"))
const Security = lazy(() => import("./Security"))
const Server = lazy(() => import("./Server"))

export { Account, AppSettings, Security, Server }
