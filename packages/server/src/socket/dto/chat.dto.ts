export class setInitDTO {
  nickname: string;
  room: {
    roomId: string;
    roomName: string;
  };
}

export class chatroomListDTO {
  roomId: string;
  hostId: string;
  roomName: string;
}
