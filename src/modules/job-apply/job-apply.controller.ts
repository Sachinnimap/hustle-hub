import { Body, Controller, Post, Request } from "@nestjs/common";
import { CreateJobApplyDto } from "./dto/create-job-apply.dto";
import { Response } from "src/common/utils/response";
import { JobApplyService } from "./job-apply.service";



@Controller('job-apply')
export class JobApplyController{
    constructor(private jobApplyService:JobApplyService){}

    @Post('/')
    async create (@Body() body:CreateJobApplyDto,@Request() req){
            return new Response(201,'Applied successfully',await this.jobApplyService.create(body,req))
    }
    
}