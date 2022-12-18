import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    const { email } = req.user;
    const user = await this.userService.findUserByEmail(email);
    res.send({
      user,
    });
  }

  @Put('info')
  @UseGuards(JwtAuthGuard)
  async putUserInfo(
    @Req() req: Request & { user: User },
    @Body() body: { nickname: string },
    @Res() res: Response,
  ) {
    const { email } = req.user;
    const { nickname } = body;

    const user = await this.userService.changeUserNickname(email, nickname);
    res.send({
      user,
    });
  }
}
