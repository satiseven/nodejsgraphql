import { User } from "../entities/User";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
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
@InputType()
class LoginInputs {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ObjectType()
class FiledError {
  @Field()
  field: string;
  message: string;
}
@ObjectType()
class UserResponse {
  @Field(() => [FiledError], { nullable: true })
  errors?: FiledError[];
  @Field(() => User, { nullable: true })
  user?: User;
}
@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async Login(
    @Arg("options", () => LoginInputs) options: LoginInputs,
    @Ctx() { em }: MyContext
  ) {
    try {
      const user = await em.findOneOrFail(User, {
        username: options.username.toLowerCase(),
      });
      const hashedPassword = await argon2.hash(options.password);
      argon2.verify;
      return true;
    } catch (error) {
      return false;
    }
  }
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
