import { Column, DataType, Table } from "sequelize-typescript";
import { AbstractModel } from "src/common/models/abstract.model";

@Table({
    tableName : 'job_apply',
    freezeTableName : true,
    timestamps : true,
})
export class JobApply extends AbstractModel{

    @Column({
        type : DataType.INTEGER,
        allowNull : false,
        field : "job_id"
    })
    jobId  : number;


    @Column({
        type : DataType.INTEGER,
        allowNull : false,
        field : "user_id"
    })
     userId : number;

}