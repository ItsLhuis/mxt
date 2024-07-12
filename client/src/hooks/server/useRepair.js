import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllRepairs,
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
      showSuccessToast("Acessório de entrada adicionado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao adicionar acessório de entrada!")
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
      showSuccessToast("Acessório de entrada eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar acessório de entrada!")
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
      showSuccessToast("Problema reportado adicionado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao adicionar problema reportado!")
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
      showSuccessToast("Problema reportado eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar problema reportado!")
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
      showSuccessToast("Trabalho realizado adicionado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao adicionar trabalho realizado!")
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
      showSuccessToast("Trabalho realizado eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar trabalho realizado!")
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
      showSuccessToast("Acessório da intervenção adicionado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao adicionar acessório da intervenção!")
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
      showSuccessToast("Acessório da intervenção eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar acessório da intervenção!")
    }
  })

  return {
    findAllRepairs,
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
