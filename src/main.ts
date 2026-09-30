import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ApiExceptionFilter } from './shared/http/api-exception.filter';
import { validationExceptionFactory } from './shared/http/validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService
      .get<string>('CORS_ORIGINS', 'http://localhost:5173')
      .split(',')
      .map((o) => o.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
}
void bootstrap();
