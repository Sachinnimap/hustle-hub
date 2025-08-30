import { Module } from "@nestjs/common";
import { JobApplyController } from "./job-apply.controller";
import { JobApplyService } from "./job-apply.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { JobApply } from "./models/job-apply.model";


@Module({
    imports :[SequelizeModule.forFeature([JobApply])],
    controllers : [JobApplyController],
    providers : [JobApplyService]
})
export class JobApplyModule{

}