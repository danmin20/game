import { io } from "socket.io-client";

const socket = io("localhost:5000", {
  transports: ["websocket"],
});

export const initSocketConnection = () => {
  if (!socket) return;
  socket.connect();
};

// 이벤트 명을 지정하고 데이터를 보냄
export const sendSocketMessage = (cmd: string, body: any = null) => {
  if (socket == null || socket.connected === false) {
    initSocketConnection();
  }
  socket.emit("message", {
    cmd,
    body,
  });
};

const cbMap = new Map();

// 해당 이벤트를 받고 콜백 함수를 실행함
export const socketInfoReceived = (cbType: string, cb: () => void) => {
  cbMap.set(cbType, cb);

  if (socket.hasListeners("message")) {
    socket.off("message");
  }

  socket.on("message", (ret) => {
    for (const [, cbValue] of cbMap) {
      cbValue(null, ret);
    }
  });
};

// 소켓 연결을 끊음
export const disconnectSocket = () => {
  if (socket == null || socket.connected === false) {
    return;
  }
  socket.disconnect();
};
