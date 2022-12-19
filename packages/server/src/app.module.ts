import { Module } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ChatroomService } from './socket/chatroom.service';
import { Chatroom } from './entity/chatroom.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeORMConfig),
    TypeOrmModule.forFeature([Chatroom]),
    AuthModule,
    UserModule,
  ],
  providers: [SocketGateway, ChatroomService],
})
export class AppModule {}
