import { Module } from '@nestjs/common';
import  {ConfigModule} from '@nestjs/config'
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal : true,
        load :[configuration]
      }),
      AuthModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
