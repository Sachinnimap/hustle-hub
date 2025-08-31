import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

   appliedJobMail(toEmail:any,subject:string,message:string) {

     this.mailerService.sendMail({
      to: toEmail,
      subject,
      text : message
    });
    
  }
}