import { useQuery, useQueryClient } from "@tanstack/react-query"

import { getUserProfile } from "@api/routes/user"

export const useUser = () => {
  const queryClient = useQueryClient()

  const userProfile = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data[0])
    }
  })

  return { userProfile }
}
