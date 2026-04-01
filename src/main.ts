import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './role/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 🔥 SEED ROLE Ở ĐÂY
  const roleRepo = app.get(getRepositoryToken(Role));

  const roles = ['NURSING', 'NHA'];

  for (const name of roles) {
    const exist = await roleRepo.findOne({ where: { name } });
    if (!exist) {
      await roleRepo.save({ name });
      console.log(`✅ Created role: ${name}`);
    }
  }

  await app.listen(3050);
}
bootstrap();