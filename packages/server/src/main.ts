import { NestFactory } from '@nestjs/core';
// import cookieParser from "cookie-parser";
import { AppModule } from './app.module';
import { SocketAdapter } from './socket/socket.adapter';

const allowOrigins = ['*'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: allowOrigins,
      credentials: true,
    },
  });
  app.useWebSocketAdapter(new SocketAdapter(app));
  // app.use(cookieParser());

  await app.listen(9001);
}
bootstrap();
