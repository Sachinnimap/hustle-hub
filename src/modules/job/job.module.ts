import { Module } from "@nestjs/common";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
    imports :[],
    controllers : [JobController],
    providers : [JobService],
    exports : []
})
export class JobModule{}