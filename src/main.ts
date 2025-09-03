import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: 'http://localhost:4200', 
    origin: 'https://lol-skins-api.onrender.com',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
