import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CreateJobDto } from './dto/createJob.dto';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { Query } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Op, Sequelize,QueryTypes } from 'sequelize';

export class JobService {
  constructor(
   @InjectConnection()  private readonly sequelize : Sequelize) {}

  async createJob(body: CreateJobDto, req) {
    const { userId } = req?.user;
    
     const { title, description } = body;

  await this.sequelize.query(
    `
      INSERT INTO job (title, description, user_id, created_at, updated_at)
      VALUES (:title, :description, :userId, NOW(), NOW())
    `,
    {
      replacements: { title, description: description || null, userId },
      type: QueryTypes.INSERT,
    }
  );

    return null;
  }

async findAll(query: PaginationDto) {
  const { pageNo = 1, limit = 10 } = query;
  const offset = (pageNo - 1) * limit;

  const jobs = await this.sequelize.query(
    `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.created_at,
        j.updated_at,
        u.name AS user_name
      FROM job j
      JOIN users u ON j.user_id = u.id
      WHERE j.deleted = false
      ORDER BY j.id DESC
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
      FROM job
      WHERE deleted = false
    `,
    {
      type: QueryTypes.SELECT,
    }
  );

  const total = countResult[0].count;

  return {
    total,
    jobs,
  };
}
async delete(id: number) {
  await this.sequelize.query(
    `
      UPDATE job
      SET deleted = true, updated_at = NOW()
      WHERE id = :id
      RETURNING id
    `,
    {
      replacements: { id },
      type: QueryTypes.UPDATE
    }
  );


  return null;
}

}
