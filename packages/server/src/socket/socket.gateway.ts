import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENT } from 'src/common/const';
import { setInitDTO } from 'src/socket/dto/chat.dto';
import { ChatRoomService } from './chatroom.service';

@WebSocketGateway(80, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly ChatRoomService: ChatRoomService) {}
  @WebSocketServer()
  server: Server;

  //소켓 연결시 유저목록에 추가
  public handleConnection(client: Socket): void {
    console.log('connected', client.id);
    client.leave(client.id);
    client.data.roomId = `room:lobby`;
    client.join('room:lobby');
  }

  //소켓 연결 해제시 유저목록에서 제거
  public handleDisconnect(client: Socket): void {
    const { roomId } = client.data;
    if (
      roomId != 'room:lobby' &&
      !this.server.sockets.adapter.rooms.get(roomId)
    ) {
      this.ChatRoomService.deleteChatRoom(roomId);
      this.server.emit(
        SOCKET_EVENT.GET_CHATROOM_LIST,
        this.ChatRoomService.getChatRoomList(),
      );
    }
    console.log('disconnected', client.id);
  }

  //메시지가 전송되면 모든 유저에게 메시지 전송
  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  sendMessage(client: Socket, message: string): void {
    client.rooms.forEach((roomId) =>
      client.to(roomId).emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
        id: client.id,
        nickname: client.data.nickname,
        message,
      }),
    );
  }

  //처음 접속시 닉네임 등 최초 설정
  @SubscribeMessage(SOCKET_EVENT.SET_INIT)
  setInit(client: Socket, data: setInitDTO): setInitDTO {
    // 이미 최초 세팅이 되어있는 경우 패스
    if (client.data.isInit) {
      return;
    }

    client.data.nickname = data.nickname
      ? data.nickname
      : '낯선사람' + client.id;

    client.data.isInit = true;

    return {
      nickname: client.data.nickname,
      room: {
        roomId: 'room:lobby',
        roomName: '로비',
      },
    };
  }

  //닉네임 변경
  @SubscribeMessage('setNickname')
  setNickname(client: Socket, nickname: string): void {
    const { roomId } = client.data;
    client.to(roomId).emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
      id: null,
      nickname: '안내',
      message: `"${client.data.nickname}"님이 "${nickname}"으로 닉네임을 변경하셨습니다.`,
    });
    client.data.nickname = nickname;
  }

  //채팅방 목록 가져오기
  @SubscribeMessage(SOCKET_EVENT.GET_CHATROOM_LIST)
  getChatRoomList(client: Socket) {
    client.emit(
      SOCKET_EVENT.GET_CHATROOM_LIST,
      this.ChatRoomService.getChatRoomList(),
    );
  }

  //채팅방 생성하기
  @SubscribeMessage(SOCKET_EVENT.CREATE_CHATROOM)
  createChatRoom(client: Socket, roomName: string) {
    //이전 방이 만약 나 혼자있던 방이면 제거
    if (
      client.data.roomId != 'room:lobby' &&
      this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    ) {
      this.ChatRoomService.deleteChatRoom(client.data.roomId);
    }

    this.ChatRoomService.createChatRoom(client, roomName);
    return {
      roomId: client.data.roomId,
      roomName: this.ChatRoomService.getChatRoom(client.data.roomId).roomName,
    };
  }

  //채팅방 들어가기
  @SubscribeMessage(SOCKET_EVENT.ENTER_CHATROOM)
  enterChatRoom(client: Socket, roomId: string) {
    //이미 접속해있는 방 일 경우 재접속 차단
    if (client.rooms.has(roomId)) {
      return;
    }
    //이전 방이 만약 나 혼자있던 방이면 제거
    if (
      client.data.roomId != 'room:lobby' &&
      this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    ) {
      this.ChatRoomService.deleteChatRoom(client.data.roomId);
    }
    this.ChatRoomService.enterChatRoom(client, roomId);
    return {
      roomId: roomId,
      roomName: this.ChatRoomService.getChatRoom(roomId).roomName,
    };
  }
}
