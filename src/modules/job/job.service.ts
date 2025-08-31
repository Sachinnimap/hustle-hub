import { InjectModel } from '@nestjs/sequelize';
import { CreateJobDto } from './dto/createJob.dto';
import { Job } from './models/job.model';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { Request } from 'express';
import { Query } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User } from '../auth/models/user.model';

export class JobService {
  constructor(@InjectModel(Job) private jobModel: typeof Job) {}

  async createJob(body: CreateJobDto, req) {
    const { userId } = req?.user;
    await this.jobModel.create({ ...body, userId: userId });
    return null;
  }

  async findAll(query: PaginationDto) {
    const { pageNo = 1, limit = 10 } = query;

    const jobs=  await  this.jobModel.findAll({
      where: { deleted: false },
       include: {
        model: User,
        attributes: ["name"],
      },
      limit : limit,
      offset : (pageNo - 1)* limit,
      order : [["id","DESC"]],
      attributes : ['title','description','createdAt','updatedAt']
    });

    const count = await this.jobModel.count({
      where: { deleted: false }})

      return {
        total : count,
        jobs
      }
  }

async delete(id:number){
       const result =  await this.jobModel.update({deleted: true},{where:{id}})

       if (Array.isArray(result) && result[0] === 0) {
      throw new BusinessException(`Job not found`);
    }
      return null;
}

}
