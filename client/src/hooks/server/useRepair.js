import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllRepairs,
  createRepair,
  deleteRepair as deleteRepairApi,
  getAllRepairStatuses,
  createRepairStatus,
  updateRepairStatus as updateRepairStatusApi,
  deleteRepairStatus as deleteRepairStatusApi,
  getAllEntryAccessories,
  createEntryAccessory,
  updateEntryAccessory as updateEntryAccessoryApi,
  deleteEntryAccessory as deleteEntryAccessoryApi,
  getAllEntryReportedIssues,
  createEntryReportedIssue,
  updateEntryReportedIssue as updateEntryReportedIssueApi,
  deleteEntryReportedIssue as deleteEntryReportedIssueApi,
  getAllInterventionWorksDone,
  createInterventionWorkDone,
  updateInterventionWorkDone as updateInterventionWorkDoneApi,
  deleteInterventionWorkDone as deleteInterventionWorkDoneApi,
  getAllInterventionAccessoriesUsed,
  createInterventionAccessoryUsed,
  updateInterventionAccessoryUsed as updateInterventionAccessoryUsedApi,
  deleteInterventionAccessoryUsed as deleteInterventionAccessoryUsedApi
} from "@api/routes/repair"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useRepair = () => {
  const queryClient = useQueryClient()

  const findAllRepairs = useQuery({
    queryKey: ["repairs"],
    queryFn: getAllRepairs,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs"], data)
    },
    refetchInterval: 60000
  })

  const createNewRepair = useMutation({
    mutationFn: createRepair,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs"])
      showSuccessToast("Reparação adicionada com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao adicionar reparação!")
    }
  })

  const deleteRepair = useMutation({
    mutationFn: deleteRepairApi,
    onSuccess: async (data, variables) => {
      const repairId = variables.repairId
      await queryClient.invalidateQueries(["repairs"])
      await queryClient.removeQueries(["repairs", repairId])
      showSuccessToast("Reparação eliminada com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar reparação!")
    }
  })

  const findAllRepairStatuses = useQuery({
    queryKey: ["repairs", "statuses"],
    queryFn: getAllRepairStatuses,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs", "statuses"], data)
    }
  })

  const createNewRepairStatus = useMutation({
    mutationFn: createRepairStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "statuses"])
    }
  })

  const updateRepairStatus = useMutation({
    mutationFn: updateRepairStatusApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "statuses"])
    }
  })

  const deleteRepairStatus = useMutation({
    mutationFn: deleteRepairStatusApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "statuses"])
    }
  })

  const findAllEntryAccessories = useQuery({
    queryKey: ["repairs", "entry-accessories"],
    queryFn: getAllEntryAccessories,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs", "entry-accessories"], data)
    }
  })

  const createNewEntryAccessory = useMutation({
    mutationFn: createEntryAccessory,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "entry-accessories"])
    }
  })

  const updateEntryAccessory = useMutation({
    mutationFn: updateEntryAccessoryApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "entry-accessories"])
    }
  })

  const deleteEntryAccessory = useMutation({
    mutationFn: deleteEntryAccessoryApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "entry-accessories"])
    }
  })

  const findAllEntryReportedIssues = useQuery({
    queryKey: ["repairs", "entry-reported-issues"],
    queryFn: getAllEntryReportedIssues,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs", "entry-reported-issues"], data)
    }
  })

  const createNewEntryReportedIssue = useMutation({
    mutationFn: createEntryReportedIssue,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "entry-reported-issues"])
    }
  })

  const updateEntryReportedIssue = useMutation({
    mutationFn: updateEntryReportedIssueApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "entry-reported-issues"])
    }
  })

  const deleteEntryReportedIssue = useMutation({
    mutationFn: deleteEntryReportedIssueApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "entry-reported-issues"])
    }
  })

  const findAllInterventionWorksDone = useQuery({
    queryKey: ["repairs", "intervention-works-done"],
    queryFn: getAllInterventionWorksDone,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs", "intervention-works-done"], data)
    }
  })

  const createNewInterventionWorkDone = useMutation({
    mutationFn: createInterventionWorkDone,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "intervention-works-done"])
    }
  })

  const updateInterventionWorkDone = useMutation({
    mutationFn: updateInterventionWorkDoneApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "intervention-works-done"])
    }
  })

  const deleteInterventionWorkDone = useMutation({
    mutationFn: deleteInterventionWorkDoneApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "intervention-works-done"])
    }
  })

  const findAllInterventionAccessoriesUsed = useQuery({
    queryKey: ["repairs", "intervention-accessories-used"],
    queryFn: getAllInterventionAccessoriesUsed,
    onSuccess: (data) => {
      queryClient.setQueryData(["repairs", "intervention-accessories-used"], data)
    }
  })

  const createNewInterventionAccessoryUsed = useMutation({
    mutationFn: createInterventionAccessoryUsed,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "intervention-accessories-used"])
    }
  })

  const updateInterventionAccessoryUsed = useMutation({
    mutationFn: updateInterventionAccessoryUsedApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "intervention-accessories-used"])
    }
  })

  const deleteInterventionAccessoryUsed = useMutation({
    mutationFn: deleteInterventionAccessoryUsedApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["repairs", "intervention-accessories-used"])
    }
  })

  return {
    findAllRepairs,
    createNewRepair,
    deleteRepair,
    findAllRepairStatuses,
    createNewRepairStatus,
    updateRepairStatus,
    deleteRepairStatus,
    findAllEntryAccessories,
    createNewEntryAccessory,
    updateEntryAccessory,
    deleteEntryAccessory,
    findAllEntryReportedIssues,
    createNewEntryReportedIssue,
    updateEntryReportedIssue,
    deleteEntryReportedIssue,
    findAllInterventionWorksDone,
    createNewInterventionWorkDone,
    updateInterventionWorkDone,
    deleteInterventionWorkDone,
    findAllInterventionAccessoriesUsed,
    createNewInterventionAccessoryUsed,
    updateInterventionAccessoryUsed,
    deleteInterventionAccessoryUsed
  }
}
