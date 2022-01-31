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

    @Column()
    password: string;

    @Field({
        nullable: true,
    })
    @Column({
        nullable: true,
    })
    company: string;

    @Field({
        nullable: true,
    })
    @Column({
        nullable: true,
    })
    description: string;

    @Field({
        nullable: true,
    })
    @Column({
        nullable: true,
    })
    contactName: string;

    @Field({
        nullable: true,
    })
    @Column({
        nullable: true,
    })
    facebook: string;

    @Field({
        nullable: true,
    })
    @Column({
        nullable: true,
    })
    instagram: string;

    @Field({
        nullable: true,
    })
    @Column({
        nullable: true,
    })
    twitter: string;

}
