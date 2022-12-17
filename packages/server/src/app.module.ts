import { Module } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { ChatRoomService } from './socket/chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategies/auth.local.strategy';
import { JwtStrategy } from './auth/strategies/auth.jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      //토큰 서명 값 설정
      secret: env.JWT_SECRET,
      //토큰 유효시간 (임의 60초)
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [
    SocketGateway,
    ChatRoomService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
