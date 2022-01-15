import { EntityManager } from '@mikro-orm/core'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { ListInputData } from 'src/types/classes/ListInputData'
import { List } from 'src/types/entities/List'
import { User } from 'src/types/entities/User'

import { cloneListAction, createListAction, deleteListAction, getCompletedLists, getListAction, getListsAction, updateListAction } from '../actions/ListActions'

@Resolver()
export class ListResolver {
  @Query(() => [List])
  async getLists (
    @Ctx('em') em: EntityManager
  ): Promise<List[]> {
    return await getListsAction(em)
  }

  @Query(() => List)
  async getList (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <List> {
    return await getListAction(id, em)
  }

  @Query(() => [List])
  async getCompletedLists (
    @Ctx('em') em: EntityManager
  ): Promise<List[]> {
    return await getCompletedLists(em)
  }

  @Mutation(() => List)
  async createList (
    @Ctx('em') em: EntityManager,
      @Ctx('user') user: User,
      @Arg('data', () => ListInputData) data: ListInputData
  ): Promise<List> {
    return await createListAction(data, user, em)
  }

  @Mutation(() => List)
  async updateList (
    @Ctx('em') em: EntityManager,
      @Ctx('user') user: User,
      @Arg('id', () => String) id: string,
      @Arg('data', () => ListInputData) data: ListInputData
  ): Promise<List> {
    return await updateListAction(id, data, user, em)
  }

  @Mutation(() => Boolean)
  async deleteList (
    @Ctx('em') em: EntityManager,
      @Ctx('user') user: User,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteListAction(id, user, em)
  }

  @Mutation(() => List)
  async cloneList (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<List> {
    return await cloneListAction(id, em)
  }
}
