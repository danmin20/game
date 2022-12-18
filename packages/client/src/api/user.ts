import { axiosInstance } from ".";

export const getNickname = async () => {
  const { data } = await axiosInstance.request({
    method: "GET",
    url: `/user/nickname`,
  });

  return data;
};
