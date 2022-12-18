import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService, // 토큰을 object로 해독하기 위함
    private readonly userService: UserService, // 사용자 id로 full정보를 얻기 위함
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (authorization) {
      try {
        const decoded = this.jwtService.decode(authorization);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('email')) {
          const user = await this.userService.findUserByEmail(decoded['email']);
          if (user) req['user'] = user;
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
