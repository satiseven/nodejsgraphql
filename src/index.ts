import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/PostsResolver";
import { UserResolver } from "./resolvers/UserResolver";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";
import { MyContext } from "./types/MyContext";
const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "qid",
      cookie: {
        sameSite: "lax",
        secure: __prod__,
        httpOnly: __prod__,
        maxAge: 100 * 60 * 60 * 24 * 365 * 10 * 3000,
      },
      saveUninitialized: true,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        disableTTL: true,
      }),
      secret: "keyboard cat",
      resave: false,
    })
  );

  const orm = await MikroORM.init(microConfig);
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });
  apolloServer.applyMiddleware({ app });
  app.get("/", (req, res) => {
    res.send("sadfasdf");
    console.log(req.session.userId);
  });
  app.listen(4000, () => {
    console.log(`Server is running on port http://localhost:4000`);
  });
};

main();
