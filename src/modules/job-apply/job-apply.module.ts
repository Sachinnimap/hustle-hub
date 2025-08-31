import { Module } from "@nestjs/common";
import { JobApplyController } from "./job-apply.controller";
import { JobApplyService } from "./job-apply.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { JobApply } from "./models/job-apply.model";
import { MailModule } from "../mail/mail.module";
import { AuthModule } from "../auth/auth.module";
import { JobModule } from "../job/job.module";


@Module({
    imports :[SequelizeModule.forFeature([JobApply]),MailModule,AuthModule,JobModule],
    controllers : [JobApplyController],
    providers : [JobApplyService],
    exports : [JobApplyService]
})
export class JobApplyModule{

}