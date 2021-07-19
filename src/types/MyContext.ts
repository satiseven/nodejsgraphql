 
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { Connection, EntityManager } from "typeorm";
 

export type MyContext = {
 
  req: Request & {
    session?: Session & {userId?:number};
  };
  redis:Redis,
  res: Response;
};
