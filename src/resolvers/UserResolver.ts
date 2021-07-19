import { User } from "../entities/User";
import argon2 from "argon2";
import { sendEmail } from "../utils/sendEmail"
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "../types/MyContext";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import {v4} from "uuid"
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
  @Mutation(()=>UserResponse)
  async changePassword(
    @Arg('token') token:string,
    @Arg('newPassword') newPassword:string,
    @Ctx() {redis,req}:MyContext
  ):Promise<UserResponse>{
    const key=FORGET_PASSWORD_PREFIX+token
const userId=await redis.get(key);
if(!userId){
 return {
   errors:[
     {
       field:"newPassword",
       message:"cant find the token"
     }
   ]
 }
}
 const user=await User.findOne({id:parseInt(userId)})
const hash =  await argon2.hash(newPassword);
await User.update({id:parseInt(userId)},{password:hash})
redis.del(key)
req.session.userId=parseInt(userId)
return {user}
}
  
  @Mutation(()=>Boolean)
  async forgetPassword(
    @Arg('email') email:string,
    @Ctx() { redis}:MyContext
  ):Promise<Boolean>{
    const user=await User.findOne({email});
    if(!user){
      return false
    }
    const token=v4();
    redis.set(FORGET_PASSWORD_PREFIX+token,user.id,'ex',1000*60*60*24)
    sendEmail(user.email,`<a href="${process.env.CLIENT_SIDE}/change-password/${token}" target="_blank">Click to reset<a>`);
      return true
  }
  @Query(() => User, { nullable: true })
  async checkLogin(@Ctx() { req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    try {
      const user=User.findOneOrFail({id: req.session.userId})
      return user;
    } catch (error) {
      return null;
    }
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => LoginInputs) options: LoginInputs,
    @Ctx() {  req }: MyContext
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

      const user = await User.findOneOrFail({
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
     

      req.session.userId = user.id;

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
    @Ctx() { req }: MyContext
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
      const user = await User.create({
        username: options.username,
        name: options.name,
        email: options.email,
        password: hashedPassword,
      }).save()
    req.session.userId=user.id;
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
  @Mutation(()=>Boolean)
  logout(
 @Ctx() {req,res}:MyContext
  ){

return new Promise(resolve=> req.session.destroy(
  err=>{
 res.clearCookie(COOKIE_NAME)
   
    if(err){
      resolve(false)
      return;
    }
    resolve(true)
    res.status(200);
  }
))
  }
}
