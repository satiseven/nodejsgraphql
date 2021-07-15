import {
  Configuration,
  Connection,
  IDatabaseDriver,
  Options,
} from "@mikro-orm/core";
import { config } from "dotenv";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
config({path:'.env'})
 

export default {
  dbName: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host:process.env.POSTGRES_HOST,
  type: "postgresql",
  debug: true,
  migrations: {
    tableName: "mikro_orm_migrations",
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    // transactional: true,
    // disableForeignKeys: true,
    // allOrNothing: true,
    // dropTables: true,
    // safe: false,
    // emit: "ts",
  },
  entities: [Post, User],
} as
  | Configuration<IDatabaseDriver<Connection>>
  | Options<IDatabaseDriver<Connection>>
  | undefined;
