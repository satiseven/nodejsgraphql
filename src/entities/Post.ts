import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;
  @Property()
  title!: string;
  @Property({ type: "date" })
  createdAt = new Date();
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
