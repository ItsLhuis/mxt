import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getAllEmployees,
  getEmployeeByUserId,
  deleteEmployee as deleteEmployeeApi,
  getUserProfile,
  createUser,
  updateUserRole as updateUserRoleApi,
  updateUserStatus as updateUserStatusApi,
  updateUserPassword as updateUserPasswordApi,
  updateUserProfile as updateUserProfileApi,
  updateUserProfileAvatar as updateUserProfileAvatarApi,
  updateUserPersonalData as updateUserPersonalDataApi
} from "@api/routes/user"

import { showSuccessToast, showErrorToast } from "@config/toast"

export const useUser = () => {
  const queryClient = useQueryClient()

  const findAllEmployees = useQuery({
    queryKey: ["users"],
    queryFn: getAllEmployees,
    onSuccess: (data) => {
      queryClient.setQueryData(["users"], data)
    },
    refetchInterval: 60000
  })

  const findEmployeeByUserId = (userId) => {
    return useQuery({
      queryKey: ["user", userId],
      queryFn: () => getEmployeeByUserId({ userId }),
      onSuccess: (data) => {
        console.log(data)
        queryClient.setQueryData(["users", userId], data)
      },
      enabled: !!userId
    })
  }

  const findUserProfile = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data[0])
    }
  })

  const createNewUser = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["users"])
    }
  })

  const updateUserRole = useMutation({
    mutationFn: updateUserRoleApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["users"])
    }
  })

  const updateUserStatus = useMutation({
    mutationFn: updateUserStatusApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["users"])
    }
  })

  const updateUserPassword = useMutation({
    mutationFn: updateUserPasswordApi
  })

  const updateUserProfile = useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["userProfile"])
    }
  })

  const updateUserPersonalData = useMutation({
    mutationFn: updateUserPersonalDataApi,
    onSuccess: async (data, variables) => {
      const userId = variables.userId
      await queryClient.invalidateQueries(["users", userId])
    }
  })

  const updateUserProfileAvatar = useMutation({
    mutationFn: updateUserProfileAvatarApi
  })

  const deleteEmployee = useMutation({
    mutationFn: deleteEmployeeApi,
    onSuccess: async (data, variables) => {
      const userId = variables.userId
      await queryClient.invalidateQueries(["users"])
      await queryClient.removeQueries(["users", userId])
      showSuccessToast("Funcionário eliminado com sucesso!")
    },
    onError: () => {
      showErrorToast("Erro ao eliminar funcionário!")
    }
  })

  return {
    findAllEmployees,
    findEmployeeByUserId,
    findUserProfile,
    createNewUser,
    updateUserRole,
    updateUserStatus,
    updateUserPassword,
    updateUserProfile,
    updateUserPersonalData,
    updateUserProfileAvatar,
    deleteEmployee
  }
}
