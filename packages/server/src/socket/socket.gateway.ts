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
import { ChatroomService } from './chatroom.service';

@WebSocketGateway(80, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly ChatroomService: ChatroomService) {}
  @WebSocketServer()
  server: Server;

  //소켓 연결시 유저목록에 추가
  public handleConnection(client: Socket) {
    console.log('connected', client.id);
    client.leave(client.id);
    client.data.roomId = `room:lobby`;
    client.join('room:lobby');
  }

  //소켓 연결 해제시 유저목록에서 제거
  public async handleDisconnect(client: Socket) {
    const { roomId } = client.data;
    if (
      roomId !== 'room:lobby' &&
      !this.server.sockets.adapter.rooms.get(roomId)
    ) {
      this.ChatroomService.deleteChatroom(roomId);
      this.server.emit(
        SOCKET_EVENT.GET_CHATROOM_LIST,
        await this.ChatroomService.getChatrooms(),
      );
    }
    console.log('disconnected', client.id);
  }

  //메시지가 전송되면 모든 유저에게 메시지 전송
  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  sendMessage(client: Socket, message: string) {
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

  //채팅방 목록 가져오기
  @SubscribeMessage(SOCKET_EVENT.GET_CHATROOM_LIST)
  async getChatroomList(client: Socket) {
    client.emit(
      SOCKET_EVENT.GET_CHATROOM_LIST,
      await this.ChatroomService.getChatrooms(),
    );
  }

  //채팅방 생성하기
  @SubscribeMessage(SOCKET_EVENT.CREATE_CHATROOM)
  async createChatroom(client: Socket, roomName: string) {
    //이전 방이 만약 나 혼자있던 방이면 제거
    if (
      client.data.roomId !== 'room:lobby' &&
      this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    ) {
      this.ChatroomService.deleteChatroom(client.data.roomId);
    }

    const chatroom = await this.ChatroomService.createChatroom(
      client,
      roomName,
    );

    return chatroom;
  }

  //채팅방 들어가기
  @SubscribeMessage(SOCKET_EVENT.ENTER_CHATROOM)
  async enterChatroom(client: Socket, roomId: string) {
    //이미 접속해있는 방 일 경우 재접속 차단
    if (client.rooms.has(roomId)) {
      return;
    }
    //이전 방이 만약 나 혼자있던 방이면 제거
    if (
      client.data.roomId !== 'room:lobby' &&
      this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
    ) {
      this.ChatroomService.deleteChatroom(client.data.roomId);
    }
    this.ChatroomService.enterChatroom(client, roomId);

    return {
      roomId: roomId,
      roomName: (await this.ChatroomService.getChatroom(roomId)).roomName,
    };
  }
}
