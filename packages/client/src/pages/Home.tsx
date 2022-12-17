import { useEffect, useState } from "react";
import {
  disconnectSocket,
  initSocketConnection,
  myInfo,
  socket,
  SocketContext,
} from "../socket-io";
import { SOCKET_EVENT } from "../const";

type Chatroom = {
  roomId: string;
  roomName: string;
};

type Message = {
  id: string;
  nickname: string;
  message: string;
};

const Home = () => {
  const [chatroomList, setChatroomList] = useState<Chatroom[]>([]);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const createChatroom = () => {
    const roomName = prompt("채팅방 이름을 입력해주세요.");
    if (!roomName) {
      return false;
    }
    socket.emit(
      SOCKET_EVENT.CREATE_CHATROOM,
      roomName,
      (res: { roomId: string; roomName: string }) => {
        if (!res) return;
        console.log(res);
      }
    );
    socket.emit(SOCKET_EVENT.GET_CHATROOM_LIST, null);
  };

  const enterChatroom = (roomId: string) => {
    socket.emit(SOCKET_EVENT.ENTER_CHATROOM, roomId, (response: Chatroom) => {
      console.log("asdf", response);
      if (!response) return;
      myInfo.room = response;
    });
  };

  socket.on(SOCKET_EVENT.GET_CHATROOM_LIST, (response: Chatroom[]) => {
    console.log("chatroomList", response);
    setChatroomList([...Object.values(response)]);
  });

  socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, (response: Message) => {
    setMessageList([...messageList, response]);
  });

  useEffect(() => {
    initSocketConnection();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <button onClick={createChatroom}>채팅방 생성</button>
      {chatroomList.map((c) => (
        <div key={c.roomId} onClick={() => enterChatroom(c.roomId)}>
          {c.roomName}
        </div>
      ))}
      {messageList.map((m) => (
        <div key={m.id}>{m.message}</div>
      ))}
    </SocketContext.Provider>
  );
};

export default Home;
