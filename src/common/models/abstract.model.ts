import { Column, Model } from "sequelize-typescript";


export abstract class AbstractModel extends Model{

    @Column({
        defaultValue : false
    })
    deleted : boolean;
}