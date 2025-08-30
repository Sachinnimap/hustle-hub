import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CreateJobDto } from "./dto/createJob.dto";
import { Response } from "src/common/utils/response";
import { JobService } from "./job.service";
import { AuthUserGuard } from "../auth/guards/auth.guard";
import { RoleGuard } from "../auth/guards/role.guard";


@Controller('job')
@UseGuards(AuthUserGuard,RoleGuard)
export class JobController{
    constructor(private jobService: JobService){}

    @Post('/')
    async create(@Body() body : CreateJobDto, @Request() req){
           return new Response(201,'Job created successfully',await this.jobService.createJob(body,req))
    }
}