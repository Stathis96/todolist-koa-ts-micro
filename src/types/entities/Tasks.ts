import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { List } from './List'
import { TypeOfWork } from '../enums/TypeOfWork'

@Entity()
@ObjectType()
export class Tasks {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @Property()
  @Field()
  name: string

  @Enum(() => TypeOfWork)
  @Field(() => TypeOfWork)
  type!: TypeOfWork // string enum defined outside of this file

  @ManyToOne(() => List)
  @Field(() => List)
  list: List

  @Property()
  @Field(() => Boolean)
  done = false
}
