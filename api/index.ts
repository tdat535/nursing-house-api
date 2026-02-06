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

    nestApp.enableCors({
      origin: [
        'http://localhost:3000',
        'https://your-frontend.vercel.app', // nếu có
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });

    nestApp.setGlobalPrefix('api');

    // ===== Swagger document =====
    const config = new DocumentBuilder()
      .setTitle('Carehome API')
      .setDescription('API quản lý viện dưỡng lão')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(nestApp, config);

    // ===== Swagger JSON =====
    server.get('/api/docs-json', (_req, res) => {
      res.json(document);
    });

    // ===== Swagger UI (CDN) =====
    server.get('/api/docs', (_req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Carehome API Docs</title>

  <!-- ✅ Swagger UI CDN CSS -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
  />
</head>
<body>
  <div id="swagger-ui"></div>

  <!-- ✅ Swagger UI CDN JS -->
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/api/docs-json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>
      `);
    });

    await nestApp.init();
    cachedApp = server;
  }

  return cachedApp;
}

export default async function handler(req, res) {
  const app = await bootstrap();
  app(req, res);
}
