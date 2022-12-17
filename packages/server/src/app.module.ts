import { Module } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { ChatRoomService } from './socket/chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
  ],
  providers: [SocketGateway, ChatRoomService],
})
export class AppModule {}
