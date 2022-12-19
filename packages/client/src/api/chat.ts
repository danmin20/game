import { axiosInstance } from ".";
import { Chatroom } from "../../../server/src/entity/chatroom.entity";

export const getChatrooms = async () => {
  const { data } = await axiosInstance.request<{ chatrooms: Chatroom[] }>({
    method: "GET",
    url: `/chat/chatrooms`,
  });

  return data;
};

export const postChatroom = async (roomName: string) => {
  const { data } = await axiosInstance.request<{ chatroom: Chatroom }>({
    method: "POST",
    url: `/chat/chatroom`,
    data: {
      roomName,
    },
  });

  return data;
};
