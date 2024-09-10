import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getAllClients,
  getClientById,
  createClient,
  updateClient as updateClientApi,
  addContactClient,
  updateContactClient as updateContactClientApi,
  deleteContactClient as deleteContactClientApi,
  addAddressClient,
  updateAddressClient as updateAddressClientApi,
  deleteAddressClient as deleteAddressClientApi,
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
    }
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

  const updateClient = useMutation({
    mutationFn: updateClientApi,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
    }
  })

  const addNewContactClient = useMutation({
    mutationFn: addContactClient,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
    }
  })

  const updateContactClient = useMutation({
    mutationFn: updateContactClientApi,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
    }
  })

  const deleteContactClient = useMutation({
    mutationFn: deleteContactClientApi,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
      showSuccessToast("Contacto eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar contacto!")
    }
  })

  const addNewAddressClient = useMutation({
    mutationFn: addAddressClient,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
    }
  })

  const updateAddressClient = useMutation({
    mutationFn: updateAddressClientApi,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
    }
  })

  const deleteAddressClient = useMutation({
    mutationFn: deleteAddressClientApi,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.invalidateQueries(["clients", clientId])
      showSuccessToast("Morada eliminada com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar morada!")
    }
  })

  const deleteClient = useMutation({
    mutationFn: deleteClientApi,
    onSuccess: async (data, variables) => {
      const clientId = variables.clientId
      await queryClient.invalidateQueries(["clients"])
      await queryClient.removeQueries(["clients", clientId])
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
    updateClient,
    addNewContactClient,
    updateContactClient,
    deleteContactClient,
    addNewAddressClient,
    updateAddressClient,
    deleteAddressClient,
    deleteClient
  }
}
