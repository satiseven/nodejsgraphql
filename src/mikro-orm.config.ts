import {
  Configuration,
  Connection,
  IDatabaseDriver,
  Options,
} from "@mikro-orm/core";
import path from "path/posix";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

export default {
  dbName: "reddit",
  user: "postgres",
  password: "satisfaction",
  type: "postgresql",
  debug: !__prod__,
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
  entities: [Post],
} as
  | Configuration<IDatabaseDriver<Connection>>
  | Options<IDatabaseDriver<Connection>>
  | undefined;
