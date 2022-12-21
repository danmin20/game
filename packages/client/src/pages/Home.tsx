import { useState } from "react";
import { chatUserInfo, socket, SocketContext } from "../socket-io";
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
      (response: Chatroom) => {
        if (!response) return;
        socket.emit(SOCKET_EVENT.GET_CHATROOM_LIST);
        navigate(`/chatroom/${response.id}`);
      }
    );
  };

  const enterChatroom = (roomId: string) => {
    socket.emit(SOCKET_EVENT.ENTER_CHATROOM, roomId, (response: Chatroom) => {
      if (!response) return;
      chatUserInfo.room = response;
      navigate(`/chatroom/${roomId}`);
    });
  };

  socket.on(SOCKET_EVENT.GET_CHATROOM_LIST, (response: Chatroom[]) => {
    setChatroomList([...Object.values(response)]);
  });

  return (
    <SocketContext.Provider value={socket}>
      <div>안녕하세요, {data?.user.nickname}님!</div>
      <button onClick={createChatroom}>채팅방 생성</button>
      {chatroomList.map((c) => (
        <div key={c.id}>
          {c.roomName} {c.numOfP}명
          {c.roomName !== "로비" && (
            <button onClick={() => enterChatroom(c.id)}>입장</button>
          )}
        </div>
      ))}
      <ChatBox />
    </SocketContext.Provider>
  );
};

export default Home;
