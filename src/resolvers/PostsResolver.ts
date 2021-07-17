import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";
@Resolver()
export class PostResolver {
  @Query(() => [Post],{nullable:true})
 async posts(@Ctx() { em }: MyContext): Promise<Post[]|null> {
    const posts = await em.find(Post, {});
    return posts;
  }
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) return null;
    if (typeof title !== undefined) {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
