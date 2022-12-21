import { useState } from "react";
import { useParams } from "react-router-dom";
import { Message } from "../common/type";
import { SOCKET_EVENT } from "../const";
import useInput from "../hooks/useInput";
import { socket } from "../socket-io";

const ChatBox = () => {
  const {
    value: messageValue,
    setValue: setMessageValue,
    onChange: onChangeMessage,
  } = useInput("");
  const { id: roomId } = useParams();

  const [messageList, setMessageList] = useState<Message[]>([]);

  const handleSendMessage = () => {
    socket.emit(SOCKET_EVENT.SEND_MESSAGE, { messageValue, roomId });
    setMessageValue("");
  };

  socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, (response: Message) => {
    setMessageList([...messageList, response]);
  });

  return (
    <div>
      <div style={{ border: "1px solid #000" }}>
        {messageList.map((m, idx) => (
          <div key={idx}>
            {m.nickname}: {m.message}
          </div>
        ))}
        <div>
          <input value={messageValue} onChange={onChangeMessage} />
          <button onClick={handleSendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
