import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    const config = new DocumentBuilder()
      .setTitle('Carehome API')
      .setDescription('API quản lý viện dưỡng lão')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('docs', nestApp, document);

    await nestApp.init();
    app = server;
  }

  return app;
}

export default async (req, res) => {
  const app = await bootstrap();
  app(req, res);
};
