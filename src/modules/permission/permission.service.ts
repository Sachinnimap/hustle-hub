import { BusinessException } from "src/common/exceptions/bussiness.exception";
import { CreatePermissionDto } from "./dto/permission.dto";
import { Permission } from "./models/permission.model";
import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionService{
    constructor(@InjectModel(Permission) private permissionModel : typeof Permission){}

async createPermission(body:CreatePermissionDto){
    const {baseUrl,method,path} =  body;

    const getPermission = await this.permissionModel.findOne({where : {baseUrl,method,path}})

    if(getPermission) throw new BusinessException("Permission already exists!")
      
        await this.permissionModel.create({...body});

    return null;
}


async getPermission(basePath:string,path:string){
    return  await this.permissionModel.findOne({where:{base_url :basePath,path}})
}
}