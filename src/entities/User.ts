import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;
  @Field(() => String)
  @Property({ name: "name" })
  name: string;
  @Field(() => String)
  @Property()
  email: string;
  @Field(() => String)
  @Property({ name: "username", unique: true })
  username!: string;
  @Field(() => String)
  @Property({ name: "password", type: "text" })
  password: string;
  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
