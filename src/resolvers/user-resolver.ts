import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {User} from "../entity/User";
import {Context} from "../types";
import {COOKIE_NAME} from "../constants";

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
        userData.email = email;
        userData.password = password;
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
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "User with that email doesn't exist",
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
                        message: "Incorrect password",
                    },
                ],
            };
        }

        req.session.userId = user.id;

        return { user };
    }
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: Context) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }

        return User.findOne(req.session.userId);
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: Context){
        return new Promise<Boolean>(resolve => {
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        })
    }
}
