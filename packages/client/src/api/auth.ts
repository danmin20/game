import { axiosInstance } from ".";

export const googleLogin = async () => {
  const { data } = await axiosInstance.request({
    method: "GET",
    url: `/auth/google`,
  });

  return data;
};
