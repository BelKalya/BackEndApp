import { InputType, Field } from "type-graphql";
@InputType()
export class UserDetails {
    @Field()
    firstName: string;
    @Field()
    lastName: string;
    @Field()
    age: number;
}
