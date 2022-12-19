export type User = {
  id: string;
  email: string;
  provider: string;
  providerId: string;
  name: string;
  nickname: string;
};

export type Chatroom = {
  roomId: string;
  roomName: string;
};

export type Message = {
  id: string;
  nickname: string;
  message: string;
};
