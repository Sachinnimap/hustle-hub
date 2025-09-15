import { BeforeCreate, BeforeUpdate, Column, DataType, Table } from "sequelize-typescript";
import { AbstractModel } from "src/common/models/abstract.model";
import * as bcrypt from 'bcrypt'


@Table({
 tableName : 'user',
 timestamps : true,
 freezeTableName : true
})
export class User extends AbstractModel {

    @Column({
        type : DataType.STRING,
        allowNull : false,
    })
    name : string;

    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    mobile : string

    @Column({
        type : DataType.STRING,
        allowNull :false,
        unique : true,
        validate : {
            isEmail :{
                msg : "Please enter valid email address"
            }
        }
    })
    email : string;

    @Column({
        type : DataType.STRING,
        allowNull : false,
    })
    password : string;

    @Column({
        type : DataType.STRING,
        allowNull : true
        
    })
    token : string;

    @Column({
        type : DataType.INTEGER,
        field : 'role_id',
        defaultValue : 3 
    })
    roleId : number

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user:User){
        console.log("run")
        const password = user.getDataValue('password')
        if(user.changed("password")){
            const generateSalt = await bcrypt.genSalt(10)
            console.log("password",password)
            console.log("generated",generateSalt)
            const hashedPassword =  await bcrypt.hash(password,generateSalt)
            console.log("hashedPasswor",hashedPassword)
            user.setDataValue('password',hashedPassword)
        }
    }
}