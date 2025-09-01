import { InjectModel } from '@nestjs/sequelize';
import { CreateJobApplyDto } from './dto/create-job-apply.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MailService } from '../mail/mail.service';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';

export class JobApplyService {
  constructor(
    private sequelize :Sequelize,
    private mailService: MailService
  ) {}

  async create(body: CreateJobApplyDto, req: any) {
    const { userId} = req?.user;
    const { jobId } = body;

    const [candidate] = await this.sequelize.query(
    `
      SELECT id, email 
      FROM users 
      WHERE id = :userId
      LIMIT 1
    `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!candidate) {
    throw new BusinessException("Candidate not found");
  }
    const [recruiter] = await this.sequelize.query<{
    id: number;
    title: string;
    user_email: string;
  }>(
    `
      SELECT j.id, j.title, u.email AS user_email
      FROM job j
      JOIN users u ON u.id = j.user_id
      WHERE j.id = :jobId
      LIMIT 1
    `,
    {
      replacements: { jobId },
      type: QueryTypes.SELECT,
    }
  );

  if (!recruiter) {
    throw new BusinessException("Job or recruiter not found");
  }
    const [application] = await this.sequelize.query(
    `
      INSERT INTO job_apply (user_id, job_id, created_at, updated_at)
      VALUES (:userId, :jobId, NOW(), NOW())
      RETURNING *
    `,
    {
      replacements: { userId: candidate['id'], jobId },
      type: QueryTypes.INSERT,
    }
  );
    // await this.jobApplyModel.bulkCreate(allJobData);

    this.mailService.appliedJobMail(candidate["email"],`Applied for ${recruiter?.title}`,`Thank you for applying for the ${recruiter?.title} position at Nimap Infotech througth Hustle-hub.`);
    this.mailService.appliedJobMail(recruiter['user_email'],`Application Recieved:${candidate["name"]} for ${recruiter?.title}`,`A new candidate applied for ${recruiter?.title}`);

    return null;
  }

 async findAllAppliedByMe(query: PaginationDto, req: any) {
  const { limit = 10, pageNo = 1 } = query;
  const { userId } = req?.user;

  const offset = (pageNo - 1) * limit;

  const appliedJobs = await this.sequelize.query(
    `
      SELECT j.id AS job_id, j.title, j.description, j.created_at, j.updated_at
      FROM job_apply ja
      JOIN job j ON ja.job_id = j.id
      WHERE ja.user_id = :userId
        AND ja.deleted = false
      ORDER BY ja.id DESC
      LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { userId, limit, offset },
      type: QueryTypes.SELECT,
    }
  );

  const countResult = await this.sequelize.query<{ count: string }>(
    `
      SELECT COUNT(*) AS count
      FROM job_apply
      WHERE user_id = :userId
        AND deleted = false
    `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );

  const total = countResult[0].count;

  return {
    total,
    jobs: appliedJobs,
  };
}

async findAll(query: PaginationDto) {
  const { limit = 10, pageNo = 1 } = query;
  const offset = (pageNo - 1) * limit;

  const jobData = await this.sequelize.query(
    `
      SELECT 
        u.name AS candidate,
        j.title AS appliedFor,
        ja.created_at
      FROM job_apply ja
      JOIN users u ON ja.user_id = u.id
      JOIN job j ON ja.job_id = j.id
      WHERE ja.deleted = false
      ORDER BY ja.id DESC
      LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
    }
  );

  const countResult = await this.sequelize.query<{ count: string }>(
    `
      SELECT COUNT(*) AS count
      FROM job_apply
      WHERE deleted = false
    `,
    {
      type: QueryTypes.SELECT,
    }
  );

  const total = countResult[0].count;

  return {
    total,
    data: jobData,
  };
}


async findAllJobsByRecruiter(query: PaginationDto, req: any) {
  const { limit = 10, pageNo = 1 } = query;
  const { userId } = req?.user;
  const offset = (pageNo - 1) * limit;

  const jobData = await this.sequelize.query(
    `
      SELECT 
        u.name AS candidate,
        j.title AS appliedFor,
        ja.created_at
      FROM job_apply ja
      JOIN users u ON ja.user_id = u.id
      JOIN job j ON ja.job_id = j.id
      WHERE j.user_id = :userId
        AND ja.deleted = false
      ORDER BY ja.id DESC
      LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { userId, limit, offset },
      type: QueryTypes.SELECT,
    }
  );

  const countResult = await this.sequelize.query<{ count: string }>(
    `
      SELECT COUNT(*) AS count
      FROM job_apply ja
      JOIN job j ON ja.job_id = j.id
      WHERE j.user_id = :userId
        AND ja.deleted = false
    `,
    {
      replacements: { userId },
      type: QueryTypes.SELECT,
    }
  );

  const total = countResult[0].count;

  return {
    total,
    jobData,
  };
}
}
