import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('nickname')
  @UseGuards(JwtAuthGuard)
  async getNickname(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    const { email } = req.user;
    const user = await this.userService.findUserByEmail(email);
    res.send({
      nickname: user.nickname,
    });
  }
}
