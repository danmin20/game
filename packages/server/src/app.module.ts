import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketGateway } from './socket/socket.gateway';
import { ChatRoomService } from './socket/chatroom.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'client', 'dist'),
    }),
  ],
  providers: [SocketGateway, ChatRoomService],
})
export class AppModule {}
