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
  @Field()
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
  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => LoginInputs) options: LoginInputs,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 5 || options.password.length < 8) {
      return {
        errors: [
          {
            field: "username",
            message: "username or password is wrong",
          },
        ],
      };
    }
    try {
      const user = await em.findOneOrFail(User, {
        username: options.username.toLowerCase(),
      });

      const isValid = await argon2.verify(user.password, options.password);
      if (!isValid) {
        return {
          errors: [
            {
              field: "password",
              message: "incorrect password",
            },
          ],
        };
      }
      req.session!.userId = user.id;
      return {
        user: user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: "username",
            message: "username dosnt exist",
          },
        ],
      };
    }
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserInputs) options: UserInputs,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (
      options.email.length < 5 ||
      options.password.length < 5 ||
      options.name.length < 5 ||
      options.username.length < 5
    ) {
      return {
        errors: [
          {
            field: "name",
            message: "Please fill all fileds",
          },
        ],
      };
    }
    try {
      const hashedPassword = await argon2.hash(options.password);
      const user = await em.create(User, {
        username: options.username,
        name: options.name,
        email: options.email,
        password: hashedPassword,
      });
      await em.persistAndFlush(user);
      return {
        user: user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: "name",
            message: "an error occur",
          },
        ],
      };
    }
  }
}
