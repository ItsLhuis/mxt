import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getAllEquipments,
  getEquipmentById,
  createEquipment,
  createEquipmentAttachment,
  deleteEquipmentAttachment as deleteEquipmentAttachmentApi,
  updateEquipment as updateEquipmentApi,
  transferEquipment as transferEquipmentApi,
  deleteEquipment as deleteEquipmentApi,
  getAllEquipmentTypes,
  getAllEquipmentBrands,
  getAllEquipmentModels,
  getAllEquipmentModelsByBrandId
} from "@api/routes/equipment"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useEquipment = () => {
  const queryClient = useQueryClient()

  const findAllEquipments = useQuery({
    queryKey: ["equipments"],
    queryFn: getAllEquipments,
    onSuccess: (data) => {
      queryClient.setQueryData(["equipments"], data)
    },
    refetchInterval: 60000
  })

  const findEquipmentById = (equipmentId) => {
    return useQuery({
      queryKey: ["equipments", equipmentId],
      queryFn: () => getEquipmentById({ equipmentId }),
      onSuccess: (data) => {
        queryClient.setQueryData(["equipments", equipmentId], data)
      },
      enabled: !!equipmentId
    })
  }

  const createNewEquipment = useMutation({
    mutationFn: createEquipment,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipments"])
    }
  })

  const addNewEquipmentAttachment = useMutation({
    mutationFn: createEquipmentAttachment,
    onSuccess: async (data, variables) => {
      const equipmentId = variables.equipmentId
      await queryClient.invalidateQueries(["equipments"])
      await queryClient.invalidateQueries(["equipments", equipmentId])
      showSuccessToast("Anexo adicionado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao adicionar anexo!")
    }
  })

  const deleteEquipmentAttachment = useMutation({
    mutationFn: deleteEquipmentAttachmentApi,
    onSuccess: async (data, variables) => {
      const equipmentId = variables.equipmentId
      await queryClient.invalidateQueries(["equipments"])
      await queryClient.invalidateQueries(["equipments", equipmentId])
      showSuccessToast("Anexo removido com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao remover anexo!")
    }
  })

  const updateEquipment = useMutation({
    mutationFn: updateEquipmentApi,
    onSuccess: async (data, variables) => {
      const equipmentId = variables.equipmentId
      await queryClient.invalidateQueries(["equipments"])
      await queryClient.invalidateQueries(["equipments", equipmentId])
    }
  })

  const transferEquipment = useMutation({
    mutationFn: transferEquipmentApi,
    onSuccess: async (data, variables) => {
      const equipmentId = variables.equipmentId
      await queryClient.invalidateQueries(["equipments"])
      await queryClient.invalidateQueries(["equipments", equipmentId])
      showSuccessToast("Equipamento transferido com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao transferir equipamento!")
    }
  })

  const deleteEquipment = useMutation({
    mutationFn: deleteEquipmentApi,
    onSuccess: async (data, variables) => {
      const equipmentId = variables.equipmentId
      await queryClient.invalidateQueries(["equipments"])
      await queryClient.removeQueries(["equipments", equipmentId])
      showSuccessToast("Equipamento eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar equipamento!")
    }
  })

  const findAllEquipmentTypes = useQuery({
    queryKey: ["equipment", "types"],
    queryFn: getAllEquipmentTypes,
    onSuccess: (data) => {
      queryClient.setQueryData(["equipment", "types"], data)
    }
  })

  const findAllEquipmentBrands = useQuery({
    queryKey: ["equipment", "brands"],
    queryFn: getAllEquipmentBrands,
    onSuccess: (data) => {
      queryClient.setQueryData(["equipment", "brands"], data)
    }
  })

  const findAllEquipmentModels = useQuery({
    queryKey: ["equipment", "models"],
    queryFn: getAllEquipmentModels,
    onSuccess: (data) => {
      queryClient.setQueryData(["equipment", "models"], data)
    }
  })

  const findAllEquipmentModelsByBrandId = (brandId) =>
    useQuery({
      queryKey: ["equipment", "models", "brand", brandId],
      queryFn: () => getAllEquipmentModelsByBrandId({ brandId }),
      onSuccess: (data) => {
        queryClient.setQueryData(["equipment", "models", "brand", brandId], data)
      },
      enabled: !!brandId
    })

  /* const findClientById = (clientId) => {
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
      showSuccessToast("Contato removido com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao remover contato!")
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
  })*/

  return {
    findAllEquipments,
    findEquipmentById,
    createNewEquipment,
    addNewEquipmentAttachment,
    deleteEquipmentAttachment,
    updateEquipment,
    transferEquipment,
    deleteEquipment,
    findAllEquipmentTypes,
    findAllEquipmentBrands,
    findAllEquipmentModels,
    findAllEquipmentModelsByBrandId
  }
}
