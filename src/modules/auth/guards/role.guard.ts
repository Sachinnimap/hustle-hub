import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Observable } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { PermissionService } from 'src/modules/permission/permission.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sequelize: Sequelize,
    //  private permissionService: PermissionService
    // @InjectModel(Permission) private permissionModel:typeof Permission
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const [basePath, path] = this.reflector.getAll(PATH_METADATA, [context.getClass(), context.getHandler(),]) || [];
     

      //   const permission =  await this.permissionService.getPermission(basePath,path)
      const permission = `select * from permission where base_url='${basePath}' and path ='${path}' and method='${request.method}'`;

      const checkPermission = await this.sequelize.query(permission, {
        type: QueryTypes.SELECT,
      });

      if (checkPermission.length == 0) throw new BusinessException('Invalid Route');
      const getRolePermission = `select * from role_permission where role_id=${request.user.roleId} and permission_id = ${checkPermission[0]['id']}`;

      const checkRolePermission = await this.sequelize.query(getRolePermission,{ type: QueryTypes.SELECT },);
      if (checkRolePermission.length == 0) throw new BusinessException('Access denied!');
      return true;
    } catch (error) {
      throw new BusinessException(
        error.message ? error.message : error.toString(),
      );
    }
  }
}
