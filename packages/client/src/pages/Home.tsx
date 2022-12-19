import { useEffect, useState } from "react";
import {
  disconnectSocket,
  initSocketConnection,
  chatUserInfo,
  socket,
  SocketContext,
} from "../socket-io";
import { SOCKET_EVENT } from "../const";
import { useGetUserInfo } from "../hooks/api/user";
import { useNavigate } from "react-router-dom";
import { Chatroom } from "../common/type";
import ChatBox from "../components/ChatBox";

const Home = () => {
  const navigate = useNavigate();
  const { data } = useGetUserInfo();

  const [chatroomList, setChatroomList] = useState<Chatroom[]>([]);

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
        socket.emit(SOCKET_EVENT.GET_CHATROOM_LIST);
        // navigate(`/chatroom/${res.roomId}`);
      }
    );
    socket.emit(SOCKET_EVENT.GET_CHATROOM_LIST);
  };

  const enterChatroom = (roomId: string) => {
    socket.emit(SOCKET_EVENT.ENTER_CHATROOM, roomId, (response: Chatroom) => {
      console.log("asdf", response);
      if (!response) return;
      chatUserInfo.room = response;
    });
  };

  socket.on(SOCKET_EVENT.GET_CHATROOM_LIST, (response: Chatroom[]) => {
    console.log("chatroomList", response);
    setChatroomList([...Object.values(response)]);
  });

  useEffect(() => {
    initSocketConnection();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <div>안녕하세요, {data?.user.nickname}님!</div>
      <button onClick={createChatroom}>채팅방 생성</button>
      {chatroomList.map((c) => (
        <div key={c.roomId}>
          {c.roomName}{" "}
          {c.roomName !== "로비" && (
            <button onClick={() => enterChatroom(c.roomId)}>입장</button>
          )}
        </div>
      ))}
      <ChatBox />
    </SocketContext.Provider>
  );
};

export default Home;
