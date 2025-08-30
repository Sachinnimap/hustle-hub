import { Module } from "@nestjs/common";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Job } from "./models/job.model";

@Module({
    imports :[SequelizeModule.forFeature([Job])],
    controllers : [JobController],
    providers : [JobService]
})
export class JobModule{}