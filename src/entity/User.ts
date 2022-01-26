import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column()
    age: number;

}
