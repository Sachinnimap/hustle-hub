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

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal : true,
        load :[configuration]
      }),
      AuthModule,
      DatabaseModule,
      PermissionModule,
      JobModule,
      JobApplyModule,
      MailModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
