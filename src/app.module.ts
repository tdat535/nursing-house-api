import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentsModule } from './residents/residents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // có thể dùng env ở toàn project
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql'>('DB_TYPE'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // chỉ dev
        migrations: ['src/migrations/*.ts'],
      }),
    }),
    ResidentsModule,
    // DailyCareRecordsModule,
    // AlertsModule,
    // MedicationsModule,
  ],
})
export class AppModule {}
