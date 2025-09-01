// import { BelongsTo, Column, DataType, Table } from "sequelize-typescript";
// import { AbstractModel } from "src/common/models/abstract.model";
// import { User } from "src/modules/auth/models/user.model";
// import { Job } from "src/modules/job/models/job.model";

// @Table({
//     tableName : 'job_apply',
//     freezeTableName : true,
//     timestamps : true,
// })
// export class JobApply extends AbstractModel{

//     @Column({
//         type : DataType.INTEGER,
//         allowNull : false,
//         field : "job_id"
//     })
//     jobId  : number;


//     @Column({
//         type : DataType.INTEGER,
//         allowNull : false,
//         field : "user_id"
//     })
//      userId : number;

//      @BelongsTo(()=> User, 'userId')
//      user : User;

//      @BelongsTo(()=> Job, 'jobId')
//      job : Job
// }