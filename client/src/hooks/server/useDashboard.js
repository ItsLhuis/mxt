import { useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { getEmployeeSummary, getEmployeeActivity } from "@api/routes/user"
import { getClientSummary, getClientActivity } from "@api/routes/client"
import { getEquipmentSummary, getEquipmentActivity } from "@api/routes/equipment"
import { getRepairSummary, getRepairActivity } from "@api/routes/repair"
import { getEmailSummary, getEmailActivity } from "@api/routes/email"
import { getSmsSummary, getSmsActivity } from "@api/routes/sms"

import { useClient } from "./useClient"
import { useEquipment } from "./useEquipment"
import { useRepair } from "./useRepair"

export const useDashboard = () => {
  const [activityYears, setActivityYears] = useState({
    employee: new Date().getFullYear(),
    client: new Date().getFullYear(),
    equipment: new Date().getFullYear(),
    repair: new Date().getFullYear(),
    email: new Date().getFullYear(),
    sms: new Date().getFullYear()
  })

  const { findAllClients } = useClient()
  const { findAllEquipments } = useEquipment()
  const { findAllRepairs } = useRepair()

  const findEmployeeSummary = useQuery({
    queryKey: ["dashboard", "employees", "summary"],
    queryFn: getEmployeeSummary
  })

  const findEmployeeActivity = useQuery({
    queryKey: ["dashboard", "employees", "activity", activityYears.employee],
    queryFn: () => getEmployeeActivity({ year: activityYears.employee }),
    enabled: !!activityYears.employee
  })

  const findClientSummary = useQuery({
    queryKey: ["dashboard", "clients", "summary"],
    queryFn: getClientSummary
  })

  const findClientActivity = useQuery({
    queryKey: ["dashboard", "clients", "activity", activityYears.client],
    queryFn: () => getClientActivity({ year: activityYears.client }),
    enabled: !!activityYears.client
  })

  const findEquipmentSummary = useQuery({
    queryKey: ["dashboard", "equipments", "summary"],
    queryFn: getEquipmentSummary
  })

  const findEquipmentActivity = useQuery({
    queryKey: ["dashboard", "equipments", "activity", activityYears.equipment],
    queryFn: () => getEquipmentActivity({ year: activityYears.equipment }),
    enabled: !!activityYears.equipment
  })

  const findRepairSummary = useQuery({
    queryKey: ["dashboard", "repairs", "summary"],
    queryFn: getRepairSummary
  })

  const findRepairActivity = useQuery({
    queryKey: ["dashboard", "repairs", "activity", activityYears.repair],
    queryFn: () => getRepairActivity({ year: activityYears.repair }),
    enabled: !!activityYears.repair
  })

  const findEmailSummary = useQuery({
    queryKey: ["dashboard", "emails", "summary"],
    queryFn: getEmailSummary
  })

  const findEmailActivity = useQuery({
    queryKey: ["dashboard", "emails", "activity", activityYears.email],
    queryFn: () => getEmailActivity({ year: activityYears.email }),
    enabled: !!activityYears.email
  })

  const findSmsSummary = useQuery({
    queryKey: ["dashboard", "smses", "summary"],
    queryFn: getSmsSummary
  })

  const findSmsActivity = useQuery({
    queryKey: ["dashboard", "smses", "activity", activityYears.sms],
    queryFn: () => getSmsActivity({ year: activityYears.sms }),
    enabled: !!activityYears.sms
  })

  const refetchAllQueries = () => {
    return Promise.all([
      findEmployeeSummary.refetch(),
      findEmployeeActivity.refetch(),
      findClientSummary.refetch(),
      findClientActivity.refetch(),
      findEquipmentSummary.refetch(),
      findEquipmentActivity.refetch(),
      findRepairSummary.refetch(),
      findRepairActivity.refetch(),
      findEmailSummary.refetch(),
      findEmailActivity.refetch(),
      findSmsSummary.refetch(),
      findSmsActivity.refetch(),
      findAllClients.refetch(),
      findAllEquipments.refetch(),
      findAllRepairs.refetch()
    ])
  }

  const queries = [
    findEmployeeSummary,
    findEmployeeActivity,
    findClientSummary,
    findClientActivity,
    findEquipmentSummary,
    findEquipmentActivity,
    findRepairSummary,
    findRepairActivity,
    findEmailSummary,
    findEmailActivity,
    findSmsSummary,
    findSmsActivity,
    findAllClients,
    findAllEquipments,
    findAllRepairs
  ]

  const isFetching = queries.some((query) => query.isFetching)
  const isRefetching = queries.some((query) => query.isRefetching)

  const updateActivityYear = (type, newYear) => {
    setActivityYears((prev) => ({
      ...prev,
      [type]: newYear
    }))
  }

  return {
    findEmployeeSummary,
    findEmployeeActivity,
    findClientSummary,
    findClientActivity,
    findEquipmentSummary,
    findEquipmentActivity,
    findRepairSummary,
    findRepairActivity,
    findEmailSummary,
    findEmailActivity,
    findSmsSummary,
    findSmsActivity,
    refetchAllQueries: {
      refetch: refetchAllQueries,
      isFetching,
      isRefetching
    },
    updateActivityYear
  }
}
