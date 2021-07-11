import { User } from "../entities/User";
import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";
@InputType()
class UserInputs {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options", () => UserInputs) options: UserInputs,
    @Ctx() { em }: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      username: options.username,
      name: options.name,
      email: options.email,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}
