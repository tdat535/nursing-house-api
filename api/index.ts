import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import path from 'path';
import swaggerUiDist from 'swagger-ui-dist';

const server = express();
let app: any;

async function bootstrap() {
    if (!app) {
        const nestApp = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server),
        );

        // 🔥 prefix chuẩn Vercel
        nestApp.setGlobalPrefix('api');

        // ===== Swagger document =====
        const config = new DocumentBuilder()
            .setTitle('Carehome API')
            .setDescription('API quản lý viện dưỡng lão')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(nestApp, config);

        // ===== SERVE SWAGGER STATIC FILES (QUAN TRỌNG) =====
        const swaggerPath = swaggerUiDist.getAbsoluteFSPath();

        server.use(
            '/api/docs',
            express.static(swaggerPath, { index: false }),
        );

        // ===== Swagger HTML =====
        server.get('/api/docs', (_req, res) => {
            res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Carehome API Docs</title>

  <!-- 🔥 Swagger CSS -->
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />

  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>

<body>
  <div id="swagger-ui"></div>

  <!-- 🔥 Swagger JS -->
  <script src="./swagger-ui-bundle.js"></script>
  <script src="./swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = function () {
      const ui = SwaggerUIBundle({
        url: '/api/docs-json',
        dom_id: '#swagger-ui',

        deepLinking: true,

        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],

        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `);
        });


        // ===== Swagger JSON =====
        server.get('/api/docs-json', (_req, res) => {
            res.json(document);
        });

        await nestApp.init();
        app = server;
    }

    return app;
}

export default async (req, res) => {
    const app = await bootstrap();
    app(req, res);
};
