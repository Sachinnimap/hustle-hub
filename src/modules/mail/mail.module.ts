import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
    useFactory: async (config:ConfigService) => {
     return{
      transport: {
        service:"Gmail",
        auth: {
          user: config.get('mail.smtp_user'),
          pass: config.get("mail.smtp_pass")
        }
      }
     }
    },
    inject:[ConfigService]
  }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
