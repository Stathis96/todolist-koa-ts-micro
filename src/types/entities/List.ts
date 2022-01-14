import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { Tasks } from './Tasks'
import { User } from './User'

import { TypeOfWork } from '../enums/TypeOfWork'

@Entity()
@ObjectType()
export class List {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @Property()
  @Field()
  @Unique()
  slug: string

  @Property()
  @Field()
  title: string

  @Enum(() => TypeOfWork)
  @Field(() => TypeOfWork)
  type!: TypeOfWork // string enum

  @Property({ nullable: false })
  @Field()
  capacity!: number

  @OneToMany(() => Tasks, t => t.list, { cascade: [Cascade.ALL] })
  @Field(() => [Tasks])
  tasks = new Collection<Tasks>(this)

  @ManyToOne(() => User)
  @Field(() => User)
  owner: User
}

// export enum TypeOfWork {
//   WORK = 'work',
//   PERSONAL = 'personal',
//   FUN = 'fun',
// }
