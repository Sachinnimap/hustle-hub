import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { CreateJobApplyDto } from "./dto/create-job-apply.dto";
import { Response } from "src/common/utils/response";
import { JobApplyService } from "./job-apply.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuthUserGuard } from "../auth/guards/auth.guard";
import { RoleGuard } from "../auth/guards/role.guard";



@Controller('job-apply')
@UseGuards(AuthUserGuard,RoleGuard)
export class JobApplyController{
    constructor(private jobApplyService:JobApplyService){}

      @Get('/')
      async findAll(@Query() query : PaginationDto){
        return new Response(200,'list of jobs applied by candidates',await this.jobApplyService.findAll(query))
    }
    
    @Post('/')
    async create (@Body() body:CreateJobApplyDto,@Request() req){
            return new Response(201,'Applied successfully',await this.jobApplyService.create(body,req))
    }

    @Get('/me')
    async findAllAppliedByMe(@Query() query : PaginationDto, @Request() req){
        return new Response(200,'list of jobs applied by you',await this.jobApplyService.findAllAppliedByMe(query,req))
    }

    @Get('/applied-candidates')
      async findAllJobsByRecruiter(@Query() query : PaginationDto, @Request() req){
        return new Response(200,'list of candidate details who applied your job posts',await this.jobApplyService.findAllJobsByRecruiter(query ,req))
    }

   
    
}