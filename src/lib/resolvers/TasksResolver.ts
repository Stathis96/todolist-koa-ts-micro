import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { EntityManager } from '@mikro-orm/core'

import { TasksInputData } from 'src/types/classes/TasksInputData'
import { Tasks } from 'src/types/entities/Tasks'

import { createTaskAction, deleteTaskAction, updateTaskAction } from 'src/lib/actions/TaskActions'
import { User } from 'src/types/entities/User'

@Resolver()
export class TaskResolver {
  @Mutation(() => Tasks)
  async createTask (
    @Ctx('em') em: EntityManager,
      @Ctx('user') user: User,
      @Arg('data', () => TasksInputData) data: TasksInputData
  ): Promise<Tasks> {
    return await createTaskAction(data, user, em)
  }

  @Mutation(() => Tasks)
  async updateTask (
    @Ctx('em') em: EntityManager,
      @Ctx('user') user: User,
      @Arg('id', () => String) id: string,
      @Arg('data', () => TasksInputData) data: TasksInputData
  ): Promise<Tasks> {
    return await updateTaskAction(id, data, user, em)
  }

  @Mutation(() => Boolean)
  async deleteTask (
    @Ctx('em') em: EntityManager,
      @Ctx('user') user: User,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteTaskAction(id, user, em)
  }
}
