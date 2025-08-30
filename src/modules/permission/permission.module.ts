import { Module } from "@nestjs/common";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Permission } from "./models/permission.model";


@Module({
    imports : [SequelizeModule.forFeature([Permission])],
    controllers : [PermissionController],
    providers :[PermissionService],
    exports : [PermissionService]
})
export class PermissionModule{}