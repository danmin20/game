import { Module } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { ChatRoomService } from './socket/chatroom.service';

@Module({
  imports: [],
  providers: [SocketGateway, ChatRoomService],
})
export class AppModule {}
