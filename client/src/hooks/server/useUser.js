import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getEmplyeeByUserId,
  getUserProfile,
  updateUserProfile as updateUserProfileApi,
  updateUserProfileAvatar as updateUserProfileAvatarApi,
  updateUserPersonalData as updateUserPersonalDataApi
} from "@api/routes/user"

export const useUser = () => {
  const queryClient = useQueryClient()

  const findEmployeeByUserId = (userId) => {
    return useQuery({
      queryKey: ["user", userId],
      queryFn: () => getEmplyeeByUserId({ userId }),
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

  return {
    findEmployeeByUserId,
    findUserProfile,
    updateUserProfile,
    updateUserPersonalData,
    updateUserProfileAvatar
  }
}
