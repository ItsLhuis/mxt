import { lazy } from "react"

import Auth from "./Auth/Auth"

import Company from "./Company/Company"

const Dashboard = lazy(() => import("./Dashboard/Dashboard"))

//Employee
const EmployeeList = lazy(() => import("./Employee/List/List"))
const AddEmployee = lazy(() => import("./Employee/Manage/Add"))
const EditEmployee = lazy(() => import("./Employee/Manage/Edit"))
//----------------------------------------------------------------------

//Client
const ClientList = lazy(() => import("./Client/List/List"))
const AddClient = lazy(() => import("./Client/Manage/Add"))
const EditClient = lazy(() => import("./Client/Manage/Edit"))
//----------------------------------------------------------------------

const Settings = lazy(() => import("./Settings/Settings"))

export {
  Auth,
  Company,
  Dashboard,
  EmployeeList,
  AddEmployee,
  EditEmployee,
  ClientList,
  AddClient,
  EditClient,
  Settings
}
