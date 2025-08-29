import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: "postgres",
          host: configService.get('database.host'),
          port: +configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.databaseName'),
          autoLoadModels: true,
          logging: true,
          sync:{
            alter:{
              drop:false
            }
          }
        }
      },
      inject : [ConfigService]
    }),
  ],
})
export class DatabaseModule {}
