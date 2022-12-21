export type User = {
  id: string;
  email: string;
  provider: string;
  providerId: string;
  name: string;
  nickname: string;
};

export type Chatroom = {
  id: string;
  hostId: string;
  roomName: string;
  numOfP: number;
};

export type Message = {
  id: string;
  nickname: string;
  message: string;
};
