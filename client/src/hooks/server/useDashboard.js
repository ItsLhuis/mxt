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

export const useDashboard = (activityYear) => {
  const { findAllClients } = useClient()
  const { findAllEquipments } = useEquipment()
  const { findAllRepairs } = useRepair()

  const findEmployeeSummary = useQuery({
    queryKey: ["dashboard", "employees", "summary"],
    queryFn: getEmployeeSummary
  })

  const findEmployeeActivity = useQuery({
    queryKey: ["dashboard", "employees", "activity", activityYear],
    queryFn: () => getEmployeeActivity({ year: activityYear }),
    enabled: !!activityYear
  })

  const findClientSummary = useQuery({
    queryKey: ["dashboard", "clients", "summary"],
    queryFn: getClientSummary
  })

  const findClientActivity = useQuery({
    queryKey: ["dashboard", "clients", "activity", activityYear],
    queryFn: () => getClientActivity({ year: activityYear }),
    enabled: !!activityYear
  })

  const findEquipmentSummary = useQuery({
    queryKey: ["dashboard", "equipments", "summary"],
    queryFn: getEquipmentSummary
  })

  const findEquipmentActivity = useQuery({
    queryKey: ["dashboard", "equipments", "activity", activityYear],
    queryFn: () => getEquipmentActivity({ year: activityYear }),
    enabled: !!activityYear
  })

  const findRepairSummary = useQuery({
    queryKey: ["dashboard", "repairs", "summary"],
    queryFn: getRepairSummary
  })

  const findRepairActivity = useQuery({
    queryKey: ["dashboard", "repairs", "activity", activityYear],
    queryFn: () => getRepairActivity({ year: activityYear }),
    enabled: !!activityYear
  })

  const findEmailSummary = useQuery({
    queryKey: ["dashboard", "emails", "summary"],
    queryFn: getEmailSummary
  })

  const findEmailActivity = useQuery({
    queryKey: ["dashboard", "emails", "activity", activityYear],
    queryFn: () => getEmailActivity({ year: activityYear }),
    enabled: !!activityYear
  })

  const findSmsSummary = useQuery({
    queryKey: ["dashboard", "smses", "summary"],
    queryFn: getSmsSummary
  })

  const findSmsActivity = useQuery({
    queryKey: ["dashboard", "smses", "activity", activityYear],
    queryFn: () => getSmsActivity({ year: activityYear }),
    enabled: !!activityYear
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

  const isFetching = () => queries.some((query) => query.isFetching)
  const isRefetching = () => queries.some((query) => query.isRefetching)

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
      isFetching: isFetching(),
      isRefetching: isRefetching()
    }
  }
}
