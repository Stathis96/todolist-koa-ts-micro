import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field()
  id: string

  @Property()
  @Field()
  name: string

  @Property()
  @Field()
  @Unique()
  email: string
}
