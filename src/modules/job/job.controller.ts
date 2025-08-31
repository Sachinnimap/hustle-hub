import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { CreateJobDto } from "./dto/createJob.dto";
import { Response } from "src/common/utils/response";
import { JobService } from "./job.service";
import { AuthUserGuard } from "../auth/guards/auth.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";


@Controller('job')
@UseGuards(AuthUserGuard,RoleGuard)
export class JobController{
    constructor(private jobService: JobService){}

    @Post('/')
    async create(@Body() body : CreateJobDto, @Request() req){
           return new Response(201,'Job created successfully',await this.jobService.createJob(body,req))
    }

    @Get("/")
    async findAll(@Query() query : PaginationDto){
        return new Response(200,'jobs fetched successfully', await this.jobService.findAll(query))
    }

     @Delete(':id')
      async delete(@Param('id') id:number){
        return new Response(201,'Deleted successfully',await this.jobService.delete(+id))
      }


}