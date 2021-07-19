import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";
@Resolver()
export class PostResolver {
  @Query(() => [Post],{nullable:true})
 async posts(): Promise<Post[]|null> {
    return Post.find({});
  }
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,

  ): Promise<Post | null> {
    return Post.findOne({ id });
  }
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
  ): Promise<Post | null> { 
    return Post.create({title}).save()
  }
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
   
  ): Promise<Post | null> {
     const post=await Post.findOne(id)
    if (!post) return null;
    if (typeof title !== "undefined") {
      await Post.update({id},{title})
    }
    return post;
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
 
  ): Promise<boolean> {
    try {
      await Post.delete(id)
      return true;
    } catch (error) {
      return false;
    }
  }
}
