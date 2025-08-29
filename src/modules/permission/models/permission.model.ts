import { Column, DataType, Table } from "sequelize-typescript";
import { AbstractModel } from "src/common/models/abstract.model";


@Table({
    tableName : "permission",
    freezeTableName : true,
    timestamps : true
})
export class Permission extends AbstractModel{
////actionName,baseUrl,method,path,description
    @Column({
         type : DataType.STRING,
         allowNull :false,
         field : 'action_name'
    })
    action_name : string 

     @Column({
         type : DataType.STRING,
         allowNull :false,
         field : 'base_url'
    })
    base_url : string

     @Column({
         type : DataType.STRING,
         allowNull :false,
    })
    method : string

     @Column({
         type : DataType.STRING,
         allowNull :false,
    })
    path : string

     @Column({
         type : DataType.STRING,
    })
    description : string
}