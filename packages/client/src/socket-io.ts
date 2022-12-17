import { createContext } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENT } from "./const";

export const socket = io("localhost:80", {
  transports: ["websocket"],
});

export const myInfo = {
  nickname: "",
  id: "",
  room: {
    roomId: "",
    roomName: "",
  },
};

socket.on("connect", () => {
  console.log("socket server connected.");

  //연결 완료 후 로컬스토리지를 확인하여 닉네임 세팅
  const nickname = localStorage.getItem("nickname");
  socket.emit(
    SOCKET_EVENT.SET_INIT,
    { nickname },
    (response: typeof myInfo) => {
      myInfo.nickname = response.nickname;
      myInfo.id = socket.id;
      myInfo.room = response.room;
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

// 소켓 연결을 끊음
export const disconnectSocket = () => {
  if (socket == null || socket.connected === false) {
    return;
  }
  socket.disconnect();
};
