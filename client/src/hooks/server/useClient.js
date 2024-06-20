import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getAllClients,
  createClient,
  addContactClient,
  addAddressClient,
  deleteClient as deleteClientApi
} from "@api/routes/clients"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useClient = () => {
  const queryClient = useQueryClient()

  const findAllClients = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    onSuccess: (data) => {
      queryClient.setQueryData(["clients"], data)
    },
    refetchInterval: 10000
  })

  const createNewClient = useMutation({
    mutationFn: createClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
    }
  })

  const addNewContactClient = useMutation({
    mutationFn: addContactClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
    }
  })

  const addNewAddressClient = useMutation({
    mutationFn: addAddressClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
    }
  })

  const deleteClient = useMutation({
    mutationFn: deleteClientApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["clients"])
      showSuccessToast("Cliente eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar cliente!")
    }
  })

  return { findAllClients, createNewClient, addNewContactClient, addNewAddressClient, deleteClient }
}
