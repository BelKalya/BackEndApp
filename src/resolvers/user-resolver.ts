import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {User} from "../entity/User";
import {UserDetails} from "./UserDetails"

@Resolver(User)
export class UserResolver{
    @Query(() => [User])
    users() {
        return User.find();
    }
    @Mutation(() => User)
    register(
        @Arg("options") options: UserDetails
    ) {
        const user = new User();
        user.email = options.email;
        user.password = options.password;
        return User.save(user);
    }
}