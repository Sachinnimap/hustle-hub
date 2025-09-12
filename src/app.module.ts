import { Module } from '@nestjs/common';
import  {ConfigModule} from '@nestjs/config'
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DatabaseModule } from './database/database.module';
import { PermissionModule } from './modules/permission/permission.module';
import { JobModule } from './modules/job/job.module';
import { JobApplyModule } from './modules/job-apply/job-apply.module';
import { MailModule } from './modules/mail/mail.module';
import { ExportModule } from './modules/export/export.module';
import {CacheModule} from '@nestjs/cache-manager'
// import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal : true,
        load :[configuration]
      }),
    //   CacheModule.registerAsync({
    //   useFactory: async () => ({
    //     store: await redisStore({
    //       socket: {
    //         host: '127.0.0.1',
    //         port: 6379,
    //       },
    //       ttl: 0, // 1 hour default
    //     }),
    //   }),
    // }),
      CacheModule.register({
          isGlobal : true,
      }),
      AuthModule,
      DatabaseModule,
      PermissionModule,
      JobModule,
      JobApplyModule,
      MailModule,
      ExportModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
