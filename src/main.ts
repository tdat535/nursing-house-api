import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://nursing-house-api.vercel.app'],
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 🔥 Swagger config
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Nursing House API')
    .setDescription('API docs hệ thống viện dưỡng lão')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🔥 docs nằm dưới /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3050);
}
bootstrap();
