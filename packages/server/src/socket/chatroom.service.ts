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

  async createChatroom(client: Socket, roomName: string) {
    const nickname: string = client.data.nickname;
    client.emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
      id: null,
      nickname: '안내',
      message: '"' + nickname + '"님이 "' + roomName + '"방을 생성하였습니다.',
    });

    const newChatroom = await this.chatroomRepository.save({
      hostId: client.data.id,
      roomName: roomName,
    });

    await this.enterChatroom(client, newChatroom.id);

    return newChatroom;
  }

  async enterChatroom(client: Socket, roomId: string) {
    client.data.roomId = roomId;
    client.rooms.clear();
    client.join(roomId);
    const { nickname } = client.data;
    const chatroom = await this.getChatroom(roomId);

    this.chatroomRepository.save({
      ...chatroom,
      numOfP: chatroom.numOfP + 1,
    });

    const { roomName } = chatroom;
    client.to(roomId).emit(SOCKET_EVENT.RECEIVE_MESSAGE, {
      id: null,
      nickname: '안내',
      message: `"${nickname}"님이 "${roomName}"방에 접속하셨습니다.`,
    });

    return {
      id: roomId,
      roomName,
    };
  }

  async exitChatroom(client: Socket, roomId: string) {
    client.data.roomId = `room:lobby`;
    client.rooms.clear();
    client.join(`room:lobby`);

    const chatroom = await this.chatroomRepository.findOne({
      where: { id: roomId },
    });
    const afterNumOfP = chatroom.numOfP - 1;
    if (afterNumOfP > 0) {
      await this.chatroomRepository.save({
        ...chatroom,
        numOfP: afterNumOfP,
      });
    } else {
      this.deleteChatroom(roomId);
    }

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
