import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleUser, JwtPayload } from 'src/common/type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // redirect google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user: GoogleUser },
    @Res() res: Response,
  ) {
    const user = await this.authService.findByProviderIdOrSave(req.user);

    const payload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken } = this.authService.getToken(payload);

    if (accessToken) {
      res.redirect(
        'http://localhost:5173/login/success?accessToken=' + accessToken,
      );
    } else {
      res.redirect('http://localhost:5173/login/failure');
    }
  }
}
