import { Request, Response } from "express";
import { Redis } from "ioredis";
import {Session} from "express-session";

export type Context = {
    req: Request & { session?: Session & { userId?: number } };
    redis: Redis;
    res: Response;
};
