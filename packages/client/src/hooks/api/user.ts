import { useQuery } from "react-query";
import { getUserInfo } from "../../api/user";

export const useGetUserInfo = () => {
  return useQuery(
    ["getUserInfo"],
    async () => {
      const data = await getUserInfo();
      return data;
    },
    {
      onError: (error: { message: string }) => {
        console.error(error.message);
      },
    }
  );
};
