import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {User} from "../entity/User";
import {UserDetails} from "./UserDetails"
import {Context} from "../types";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver(User)
export class UserResolver{
    @Mutation(() => UserResponse)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() {req}: Context
    ): Promise<UserResponse> {
        const userData = new User();
        const bcrypt = require('bcrypt');
        const salt = bcrypt.genSaltSync(10);
        const passwordToSave = bcrypt.hashSync(password, salt);
        const userWithEmail = await User.findOne({ where: { email: email } });
        if (userWithEmail) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "that email already exists",
                    },
                ],
            };
        }
        userData.email = email;
        userData.password = passwordToSave;
        const user = await User.save(userData);
        req.session.userId = user.id;
        return { user };
    }
    @Mutation(() => UserResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() {req}: Context
    ): Promise<UserResponse> {
        const id = 1;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "that email doesn't exist",
                    },
                ],
            };
        }
        const valid = user.password === password;
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        req.session.userId = user.id;

        return { user };
    }
}
