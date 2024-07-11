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
  createEquipmentType,
  updateEquipmentType as updateEquipmentTypeApi,
  deleteEquipmentType as deleteEquipmentTypeApi,
  getAllEquipmentBrands,
  createEquipmentBrand,
  updateEquipmentBrand as updateEquipmentBrandApi,
  deleteEquipmentBrand as deleteEquipmentBrandApi,
  getAllEquipmentModels,
  getAllEquipmentModelsByBrandId,
  createEquipmentModel,
  updateEquipmentModel as updateEquipmentModelApi,
  deleteEquipmentModel as deleteEquipmentModelApi
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
      showSuccessToast("Anexo eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar anexo!")
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

  const createNewEquipmentType = useMutation({
    mutationFn: createEquipmentType,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipment", "types"])
    }
  })

  const updateEquipmentType = useMutation({
    mutationFn: updateEquipmentTypeApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipment", "types"])
    }
  })

  const deleteEquipmentType = useMutation({
    mutationFn: deleteEquipmentTypeApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipment", "types"])
    }
  })

  const findAllEquipmentBrands = useQuery({
    queryKey: ["equipment", "brands"],
    queryFn: getAllEquipmentBrands,
    onSuccess: (data) => {
      queryClient.setQueryData(["equipment", "brands"], data)
    }
  })

  const createNewEquipmentBrand = useMutation({
    mutationFn: createEquipmentBrand,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipment", "brands"])
    }
  })

  const updateEquipmentBrand = useMutation({
    mutationFn: updateEquipmentBrandApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipment", "brands"])
    }
  })

  const deleteEquipmentBrand = useMutation({
    mutationFn: deleteEquipmentBrandApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["equipment", "brands"])
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

  const createNewEquipmentModel = useMutation({
    mutationFn: createEquipmentModel,
    onSuccess: async (data, variables) => {
      const brandId = variables.brandId
      await queryClient.invalidateQueries(["equipment", "models"])
      await queryClient.invalidateQueries(["equipment", "models", "brand", brandId])
    }
  })

  const updateEquipmentModel = useMutation({
    mutationFn: updateEquipmentModelApi,
    onSuccess: async (data, variables) => {
      const brandId = variables.brandId
      await queryClient.invalidateQueries(["equipment", "models"])
      await queryClient.invalidateQueries(["equipment", "models", "brand", brandId])
    }
  })

  const deleteEquipmentModel = useMutation({
    mutationFn: deleteEquipmentModelApi,
    onSuccess: async (data, variables) => {
      const brandId = variables.modbrandIdelId
      await queryClient.invalidateQueries(["equipment", "models"])
      await queryClient.removeQueries(["equipment", "models", "brand", brandId])
    }
  })

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
    createNewEquipmentType,
    updateEquipmentType,
    deleteEquipmentType,
    findAllEquipmentBrands,
    createNewEquipmentBrand,
    updateEquipmentBrand,
    deleteEquipmentBrand,
    findAllEquipmentModels,
    findAllEquipmentModelsByBrandId,
    createNewEquipmentModel,
    updateEquipmentModel,
    deleteEquipmentModel
  }
}
