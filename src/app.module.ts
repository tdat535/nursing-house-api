import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentsModule } from './residents/residents.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { ServiceModule } from './Service/service.module';
import { HealthCheckModule } from './HealthCheck/health-check.module';
import { MedicationsModule } from './residents/medications.module';
import { DrugsModule } from './drugs/drugs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql'>('DB_TYPE'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: ['src/migrations/*.ts'],
      }),
    }),
    ResidentsModule,
    RoomModule,
    ServiceModule,
    HealthCheckModule,
    MedicationsModule,
    DrugsModule,
    
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
