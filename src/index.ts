import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello-resolver";
import {UserResolver} from "./resolvers/user-resolver";

const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: [User],
    });

    const app = express();

    const appoloServer = new ApolloServer({
        schema: await buildSchema(
            {
                resolvers: [HelloResolver, UserResolver]
            }
        ),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });

    await appoloServer.start();
    appoloServer.applyMiddleware({ app });

    app.listen(parseInt(process.env.PORT), () => {
        console.log("server started on localhost:4000");
    });
}

main().catch((err) => {
    console.error(err);
});