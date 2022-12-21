import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { SOCKET_EVENT } from "../const";
import { socket } from "../socket-io";
import { createBrowserHistory } from "history";

const Chatroom = () => {
  const { id: roomId } = useParams();
  const history = createBrowserHistory();
  const navigate = useNavigate();

  const handleExitRoom = () => {
    const isExist = window.confirm("채팅방을 나가시겠습니까?");
    if (isExist) {
      socket.emit(SOCKET_EVENT.EXIT_CHATROOM, roomId);
      socket.emit(SOCKET_EVENT.GET_CHATROOM_LIST);
      navigate("/");
    }
  };

  useEffect(() => {
    const onListenHistoryEvent = history.listen(({ action }) => {
      console.log("action", action);
      if (action === "POP") {
        handleExitRoom();
      }
    });

    return () => onListenHistoryEvent();
  }, [roomId]);

  return (
    <div>
      <ChatBox />
      <button onClick={handleExitRoom}>나가기</button>
    </div>
  );
};

export default Chatroom;
