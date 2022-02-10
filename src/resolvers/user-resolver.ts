import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {User} from "../entity/User";
import {Context} from "../types";
import {COOKIE_NAME} from "../constants";
import * as bcrypt from "bcrypt";
import {UserDetails} from "./UserDetails";

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
        const salt = bcrypt.genSaltSync(10);
        const passwordToSave = bcrypt.hashSync(password, salt);
        userData.email = email;
        userData.password = passwordToSave;
        try {
            const user = await User.save(userData);
            req.session.userId = user.id;
            return { user };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "that email already exists",
                    },
                ],
            };
        }
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
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
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
        return { user }
    }
    @Mutation(() => UserResponse)
    async update(
        @Arg("options") options: UserDetails,
        @Ctx() {req}: Context
    ): Promise<UserResponse> {
        const userData = await User.findOne(req.session.userId);
        userData.company = options.company;
        userData.contactName = options.contactName;
        userData.description = options.description;
        userData.facebook = options.facebook;
        userData.instagram = options.instagram;
        userData.twitter = options.twitter;
        const user = await User.save(userData);
        req.session.userId = user.id;
        return { user };
    }
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: Context) {
        // you are not logged in
        console.log('you are not logged in')
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
