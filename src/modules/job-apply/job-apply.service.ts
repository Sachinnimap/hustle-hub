import { InjectModel } from '@nestjs/sequelize';
import { CreateJobApplyDto } from './dto/create-job-apply.dto';
import { JobApply } from './models/job-apply.model';
import { Job } from '../job/models/job.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from '../auth/models/user.model';
import { MailService } from '../mail/mail.service';
import { Op, Sequelize } from 'sequelize';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';

export class JobApplyService {
  constructor(
    private mailService: MailService,
    @InjectModel(JobApply) private jobApplyModel: typeof JobApply,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Job) private jobModel: typeof Job,
  ) {}

  async create(body: CreateJobApplyDto, req: any) {
    const { userId} = req?.user;
    const { jobId } = body;

    const candidate = await this.userModel.findOne({ where: { id: userId } ,raw:true});
    const recruiter = await this.jobModel.findOne({
      where: { id: jobId },
      include :{
        model : User,
        attributes :['name','email']
      },
      raw:true,
      nest :true
    });
    await this.jobApplyModel.create({ jobId,userId });
    // await this.jobApplyModel.bulkCreate(allJobData);

    this.mailService.appliedJobMail(candidate?.email,`Applied for ${recruiter?.title}`,`Thank you for applying for the ${recruiter?.title} position at Nimap Infotech througth Hustle-hub.`);
    this.mailService.appliedJobMail(recruiter?.user?.email,`Application Recieved:${candidate?.name} for ${recruiter?.title}`,`A new candidate applied for ${recruiter?.title}`);

    return null;
  }

  async findAllAppliedByMe(query: PaginationDto, req: any) {
    const { limit = 10, pageNo = 1 } = query;
    const {userId} =  req?.user;

    const appliedJobData = await this.jobApplyModel.findAll({
      where: { deleted: false,  userId},
      include: {
        model: Job,
        attributes: ['title', 'description', 'createdAt', 'updatedAt'],
      },
      attributes: [],
      limit: limit,
      offset: (pageNo - 1) * limit,
      order: [['id', 'DESC']],
    });

    const count = await this.jobApplyModel.count({
      where: { deleted: false,  userId },
    });

    return {
      total: count,
      jobs: appliedJobData,
    };
  }

   async findAll(query: PaginationDto) {
    const { limit = 10, pageNo = 1 } = query;

    const jobData = await this.jobApplyModel.findAll({
      where: { deleted: false},

      include: [
        {
          model  : User,
          attributes : []
        },
        {
        model: Job,
        attributes: [],
      }],
      attributes: [ [Sequelize.col('user.name'), 'candidate'],[Sequelize.col('job.title'), 'appliedFor'],'createdAt',],
      limit: limit,
      offset: (pageNo - 1) * limit,
      order: [['id', 'DESC']],
      raw : true
    });

    const count = await this.jobApplyModel.count({
      where: { deleted: false },
    });

    return {
      total: count,
      data: jobData,
    };
  }


  async findAllJobsByRecruiter(query : PaginationDto ,req:any){
    const { limit = 10, pageNo = 1 } = query;
    const {userId} = req?.user;
    const jobData =  await this.jobApplyModel.findAll({
        include :[{
            model :User,
            attributes : []
        },
        {
            model : Job,
            attributes : [],
            where : {userId}
        }
    ],
    attributes : ['createdAt', [Sequelize.col('user.name'), 'candidate'],[Sequelize.col('job.title'), 'appliedFor'],],
     limit: limit,
    offset: (pageNo - 1) * limit,
      order: [['id', 'DESC']],
      raw :true
    })
    const total =  await this.jobApplyModel.count({
        include :[
        {
            model : Job,
            attributes : [],
            where : {userId }
        }
    ]
    })

        return {
            total,
            jobData 
        }
  }
}
