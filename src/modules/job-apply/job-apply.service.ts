import { InjectModel } from "@nestjs/sequelize";
import { CreateJobApplyDto } from "./dto/create-job-apply.dto";
import { JobApply } from "./models/job-apply.model";


export class JobApplyService{

    constructor(@InjectModel(JobApply) private jobApplyModel : typeof JobApply ){}


    async create(body :CreateJobApplyDto,req){
        // const {userId} = req?.user;
        const {jobIds} = body

        const allJobData = jobIds.map((jobId) => ({userId:1,jobId}));
        await this.jobApplyModel.bulkCreate(allJobData)

        return null
    }
}