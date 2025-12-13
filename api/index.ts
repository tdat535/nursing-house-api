import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    nestApp.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('Carehome API')
      .setDescription('API quản lý viện dưỡng lão')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(nestApp, config);

    // 👉 EXPORT JSON RIÊNG
    nestApp.getHttpAdapter().get('/api/docs-json', (req, res) => {
      res.json(document);
    });

    // 👉 DÙNG CDN, KHÔNG DÙNG STATIC FILES
    SwaggerModule.setup('docs', nestApp, document, {
      customCssUrl:
        'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
      swaggerOptions: {
        url: '/api/docs-json',
      },
    });

    await nestApp.init();
    cachedApp = server;
  }

  return cachedApp;
}

export default async (req, res) => {
  const app = await bootstrap();
  app(req, res);
};
