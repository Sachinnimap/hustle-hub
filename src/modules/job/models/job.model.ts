import { Column, DataType, Table } from "sequelize-typescript";
import { AbstractModel } from "src/common/models/abstract.model";


@Table({
    tableName : "job",
    freezeTableName : true,
    timestamps : true
})
export class Job extends AbstractModel{

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    title : string;

    @Column({
        type : DataType.STRING
    })
    description : string

     @Column({
        type : DataType.INTEGER,
        field: 'user_id'
    })
    userId : number

}