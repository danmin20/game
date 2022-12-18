import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleWare } from 'src/auth/middlewares/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule implements NestModule {
  // 위에서 작성한 미들웨어를 consumer에 적용 시킨다.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
