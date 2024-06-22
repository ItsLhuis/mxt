import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getAllClients,
  getClientById,
  createClient,
  addContactClient,
  addAddressClient,
  deleteClient as deleteClientApi
} from "@api/routes/client"

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

  const findClientById = (clientId) => {
    return useQuery({
      queryKey: ["clients", clientId],
      queryFn: () => getClientById({ clientId }),
      onSuccess: (data) => {
        queryClient.setQueryData(["clients", clientId], data)
      },
      enabled: !!clientId
    })
  }

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

  return {
    findAllClients,
    findClientById,
    createNewClient,
    addNewContactClient,
    addNewAddressClient,
    deleteClient
  }
}
