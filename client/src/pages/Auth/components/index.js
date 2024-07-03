import { lazy } from "react"

const Login = lazy(() => import("./Login"))

const ResetPasswordRequest = lazy(() => import("./ResetPassword/Request"))
const ResetPasswordVerify = lazy(() => import("./ResetPassword/Verify"))
const ResetPasswordConfirm = lazy(() => import("./ResetPassword/Confirm"))

export { Login, ResetPasswordRequest, ResetPasswordVerify, ResetPasswordConfirm }
