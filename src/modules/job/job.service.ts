import { InjectModel } from "@nestjs/sequelize";
import { CreateJobDto } from "./dto/createJob.dto";
import { Job } from "./models/job.model";
import { BusinessException } from "src/common/exceptions/bussiness.exception";
import { Request } from "express";



export class JobService{
    constructor(@InjectModel(Job) private jobModel: typeof Job){}

    async createJob(body : CreateJobDto,req){
        const {roleId,userId} = req?.user;    //  req?.['user']['roleId']

        if(roleId != 2)  throw new BusinessException("Only recruiter can create job")
        await this.jobModel.create({...body,userId :userId})
        return null;
    }


}