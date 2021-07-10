import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { HelloResolver } from "./resolvers/hello";
const main = async () => {
  const app = express();
  const orm = await MikroORM.init(microConfig);
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });
  apolloServer.applyMiddleware({ app });
  app.get("/", (_, res) => {
    res.send("sadfasdf");
  });
  app.listen(4000, () => {
    console.log(`Server is running on port http://localhost:4000`);
  });
};

main();
