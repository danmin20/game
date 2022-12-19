import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { SOCKET_EVENT } from 'src/common/const';
import { Chatroom } from 'src/entity/chatroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  async createChatroom(client: Socket, roomName: string): Promise<Chatroom> {
    const nickname: string = client.data.nickname;
    client.emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
      id: null,
      nickname: '안내',
      message: '"' + nickname + '"님이 "' + roomName + '"방을 생성하였습니다.',
    });

    const chatroom = new Chatroom();
    chatroom.hostId = client.id;
    chatroom.roomName = roomName;

    const newChatroom = await this.chatroomRepository.save({
      hostId: client.id,
      roomName: roomName,
    });

    client.data.roomId = newChatroom.id;
    client.rooms.clear();
    client.join(newChatroom.id);

    return newChatroom;
  }

  async enterChatroom(client: Socket, roomId: string) {
    client.data.roomId = roomId;
    client.rooms.clear();
    client.join(roomId);
    const { nickname } = client.data;
    const { roomName } = await this.getChatroom(roomId);
    client.to(roomId).emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
      id: null,
      nickname: '안내',
      message: `"${nickname}"님이 "${roomName}"방에 접속하셨습니다.`,
    });
  }

  exitChatroom(client: Socket, roomId: string) {
    client.data.roomId = `room:lobby`;
    client.rooms.clear();
    client.join(`room:lobby`);
    const { nickname } = client.data;
    client.to(roomId).emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
      id: null,
      nickname: '안내',
      message: '"' + nickname + '"님이 방에서 나갔습니다.',
    });
  }

  async getChatroom(roomId: string) {
    const chatroom = await this.chatroomRepository.findOne({
      where: { id: roomId },
    });

    return chatroom;
  }

  async getChatrooms() {
    const chatrooms = await this.chatroomRepository.find({
      withDeleted: false,
    });
    return chatrooms;
  }

  async deleteChatroom(roomId: string) {
    const chatroom = await this.chatroomRepository.findOne({
      where: { id: roomId },
    });

    await this.chatroomRepository.save({
      ...chatroom,
      deletedAt: new Date(),
    });
  }
}
