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
import cors from 'cors';
 import { config } from "dotenv";
const main = async () => {
  config({path:'.env'})
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient(
    {
      password:process.env.REDIS_PASSWORD,
      host:process.env.REDIS_HOST,
      port: parseInt(<string>process.env.REDIS_PORT) || 10657 ,
    }
  );
  app.use(
    session({
      name: "qid",
      cookie: {
        sameSite: "lax",
        secure: __prod__,
        httpOnly: __prod__,
        maxAge: 100 * 60 * 60 * 24 * 365,
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
app.use(
  cors(
    {
      origin: process.env.CLIENT_SIDE,
      credentials:true
    }
  )
)
  const orm = await MikroORM.init(microConfig);
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });
  apolloServer.applyMiddleware({
    app,
    cors:false,
  });
  app.get("/", (_, res) => {
    res.send("Test Server");
    
  });
  app.listen(4000, () => {
    console.log("Client link is :" + process.env.CLIENT_SIDE);
    console.log(`Server is running on port http://localhost:4000`);
  });
};

main();
