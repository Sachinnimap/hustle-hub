import { isEmail } from "class-validator";
import { Column, DataType, Model, Table } from "sequelize-typescript";


@Table({
    tableName : 'reset-password',
    timestamps : true,
    freezeTableName : true
})
export class ResetPassword extends Model{

    @Column({
        type : DataType.STRING,
        allowNull : false,
        validate :{
            isEmail: {msg : "Please enter valid email address!"}
        }
    })
    email : string;


    @Column({
        type : DataType.STRING,
        allowNull : false,
        validate : {
            let : {
                args : [6,6],
                message: "Please enter valid OTP"
            }
        }
    })
    otp : string
}