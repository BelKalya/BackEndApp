import {Field, InputType} from "type-graphql";

@InputType()
export class UserDetails {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field({
        nullable: true}
    )
    company: string;

    @Field({
        nullable: true}
    )
    description: string;

    @Field({
        nullable: true}
    )
    contactName: string;

    @Field({
        nullable: true}
    )
    facebook: string;

    @Field({
        nullable: true}
    )
    instagram: string;

    @Field({
        nullable: true}
    )
    twitter: string;
}
