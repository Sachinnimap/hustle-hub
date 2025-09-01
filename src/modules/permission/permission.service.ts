import { BusinessException } from "src/common/exceptions/bussiness.exception";
import { CreatePermissionDto } from "./dto/permission.dto";
import { Permission } from "./models/permission.model";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { Op, QueryTypes, Sequelize } from 'sequelize';

@Injectable()
export class PermissionService{
    
    constructor(@InjectConnection() private readonly sequelize :Sequelize,@InjectModel(Permission) private permissionModel : typeof Permission){}

async createPermission(body: CreatePermissionDto) {
  const { baseUrl, method, path, actionName, description } = body;

  // 1. Check if the permission already exists
  const existing = await this.sequelize.query(
    `
      SELECT id
      FROM permission
      WHERE base_url = :baseUrl
        AND method = :method
        AND path = :path
      LIMIT 1
    `,
    {
      replacements: { baseUrl, method, path },
      type: QueryTypes.SELECT,
    }
  );

  if (existing.length > 0) {
    throw new BusinessException("Permission already exists!");
  }

  // 2. Insert new permission
  await this.sequelize.query(
    `
      INSERT INTO permission (action_name, base_url, method, path, description, created_at, updated_at)
      VALUES (:actionName, :baseUrl, :method, :path, :description, NOW(), NOW())
    `,
    {
      replacements: { actionName, baseUrl, method, path, description: description || null },
      type: QueryTypes.INSERT,
    }
  );

  return null;
}


async  findPermission(basePath: string, path: string) {
  const [permission] = await this.sequelize.query(
    `
      SELECT *
      FROM permission
      WHERE base_url = :basePath
        AND path = :path
      LIMIT 1
    `,
    {
      replacements: { basePath, path },
      type: QueryTypes.SELECT,
    }
  );

  return permission || null;
}

}