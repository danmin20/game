import { axiosInstance } from ".";
import { User } from "../../../server/src/entity/user.entity";

export const getUserInfo = async () => {
  const { data } = await axiosInstance.request<{ user: User }>({
    method: "GET",
    url: `/user/info`,
  });

  return data;
};

export const putUserInfo = async (nickname: string) => {
  const { data } = await axiosInstance.request<{ user: User }>({
    method: "PUT",
    url: `/user/info`,
    data: {
      nickname,
    },
  });

  return data;
};
