import { createContext } from "react";
import { io } from "socket.io-client";
import { getUserInfo } from "./api/user";
import { SOCKET_EVENT } from "./const";

export const socket = io("localhost:80", {
  transports: ["websocket"],
});

export const chatUserInfo = {
  id: "",
  nickname: "",
  room: {
    id: "",
    roomName: "",
  },
};

socket.on("connect", async () => {
  console.log("socket server connected.");

  const userInfo = await getUserInfo();

  socket.emit(
    SOCKET_EVENT.SET_INIT,
    { ...userInfo.user },
    (response: typeof chatUserInfo) => {
      chatUserInfo.id = socket.id;
      chatUserInfo.nickname = response.nickname;
      chatUserInfo.room = response.room;
    }
  );

  socket.emit(SOCKET_EVENT.GET_CHATROOM_LIST, null);
});

socket.on("disconnect", () => {
  console.log("socket server disconnected.");
});

export const initSocketConnection = () => {
  if (!socket) return;
  socket.connect();
};

export const SocketContext = createContext(socket);

export const disconnectSocket = () => {
  if (socket == null || socket.connected === false) {
    return;
  }
  socket.disconnect();
};
