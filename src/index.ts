import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from "express";
import * as cors from "cors";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello-resolver";
import {UserResolver} from "./resolvers/user-resolver";
import * as Redis from "ioredis";
import * as session from 'express-session';
import {__prod__, COOKIE_NAME} from "./constants";
import {Context} from "./types";
import * as connectRedis from 'connect-redis';

const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: [User],
    });
    const app = express();
    const RedisStore = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL);
    app.set("trust proxy", 1);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN.split(", "),
            credentials: true,
        })
    );
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30, // ~1 month
                httpOnly: true,
                sameSite: "lax",
                secure: __prod__,
                domain: __prod__ ? ".futuredomain.com" : undefined,
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        })
    );
    const appoloServer = new ApolloServer({
        schema: await buildSchema(
            {
                resolvers: [HelloResolver, UserResolver]
            }
        ),
        context: ({req, res}): Context => ({
            req,
            redis,
            res,
        }),
    });

    await appoloServer.start();

    appoloServer.applyMiddleware({app, cors: false});

    app.listen(parseInt(process.env.PORT), () => {
        console.log("server started on localhost:4000");
    });
}

main().catch((err) => {
    console.error(err);
});