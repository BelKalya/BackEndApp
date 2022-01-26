import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({
        unique: true,
    })
    email: string;

    @Field()
    @Column()
    password: string;

    @Field()
    @Column({
        nullable: true,
    })
    company: string;

    @Field()
    @Column({
        nullable: true,
    })
    description: string;

    @Field()
    @Column({
        nullable: true,
    })
    contactName: string;

    @Field()
    @Column({
        nullable: true,
    })
    facebook: string;

    @Field()
    @Column({
        nullable: true,
    })
    instagram: string;

    @Field()
    @Column({
        nullable: true,
    })
    twitter: string;

}
