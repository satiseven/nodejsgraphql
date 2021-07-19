 import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@ObjectType()
@Entity()
export class Post extends BaseEntity{
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;
  @Field(() => String)
  @Column({type:"text"})
  title!: string;
  @Field(() => String)
  @CreateDateColumn({ type: "date" })
  createdAt = new Date();
  @Field(() => String)
  @UpdateDateColumn({type:"date"})
  updatedAt = new Date();
}
