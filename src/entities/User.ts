 import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;
  @Field(() => String)
  @Column({ name: "name" })
  name: string;
  @Field(() => String)
  @Column({unique:true})
  email: string;
  @Field(() => String)
  @Column({ name: "username", unique: true })
  username!: string;
  @Field(() => String)
  @Column({ name: "password", type: "text" })
  password: string;
  @Field(() => String)
  @CreateDateColumn()
  createdAt : Date;
  @UpdateDateColumn()
  updatedAt :  Date;
}
