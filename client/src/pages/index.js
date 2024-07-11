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

//Equipment
const EquipmentList = lazy(() => import("./Equipment/List/List"))
const AddEquipment = lazy(() => import("./Equipment/Manage/Add"))
const EditEquipment = lazy(() => import("./Equipment/Manage/Edit"))

//Equipment Type
const EquipmentTypeList = lazy(() => import("./Equipment/Attributes/Type/List"))
//----------------------------------------------------------------------

//Equipment Brand
const EquipmentBrandList = lazy(() => import("./Equipment/Attributes/Brand/List"))
//----------------------------------------------------------------------

//Equipment Model
const EquipmentModelList = lazy(() => import("./Equipment/Attributes/Model/List"))
//----------------------------------------------------------------------
//----------------------------------------------------------------------

//Repair
const RepairList = lazy(() => import("./Repair/List/List"))
//----------------------------------------------------------------------

//Email
const EmailList = lazy(() => import("./Email/List/List"))
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
  EquipmentList,
  AddEquipment,
  EditEquipment,
  EquipmentTypeList,
  EquipmentBrandList,
  EquipmentModelList,
  RepairList,
  EmailList,
  Settings
}
