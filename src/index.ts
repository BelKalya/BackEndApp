import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";

const main = async () => {
    console.log('testw');
    const conn = await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: [User],
    });
}

main();