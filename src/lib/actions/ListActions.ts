import { EntityManager } from '@mikro-orm/core'
import { AuthenticationError, UserInputError } from 'apollo-server-koa'
// import { v4 } from 'uuid'

import { ListInputData } from 'src/types/classes/ListInputData'

import { List } from 'src/types/entities/List'
import { Tasks } from 'src/types/entities/Tasks'
import { User } from 'src/types/entities/User'

export async function getListsAction (em: EntityManager): Promise<List[]> {
  return await em.find(List, {}, ['tasks', 'owner'])
}

export async function getListAction (id: string, em: EntityManager): Promise<List> {
  const list = await em.findOneOrFail(List, { id }, ['tasks', 'owner'])
  return list
}

export async function getCompletedLists (em: EntityManager): Promise<List[]> {
  const lists = await em.find(List, {}, ['tasks', 'owner'])
  return lists.filter(element => element.tasks.getItems().every(task => task.done))
}

export async function createListAction (data: ListInputData, user: User, em: EntityManager): Promise<List> {
  // const user = await em.findOneOrFail(User, {id: data.owner_id})
  console.log('user is ', user)
  const lists = await em.find(List, {}, ['tasks', 'owner'])
  const exists = lists.filter(element => element.slug === data.slug)

  if (exists.length >= 1) {
    throw new UserInputError('Cant use same slug with other list')
  }

  const list = em.create(List, { ...data, owner: user })
  // console.log('USERID', user.id + 'listownerid', list.owner.id)
  // if (user.id !== list.owner.id) {
  //   throw new NotFoundError('User must be registered')
  // }
  await em.persistAndFlush(list)

  return list
}

export async function updateListAction (id: string, data: ListInputData, user: User, em: EntityManager): Promise<List> {
  const list = await em.findOneOrFail(List, { id })
  // const user = await em.findOneOrFail(User, {id: data.owner_id})

  // todo check if logged user is owner
  if (user.id !== list.owner.id) {
    throw new AuthenticationError('Logged in user must be also the owner to update a list')
  }

  const lists = await em.find(List, {}, ['tasks', 'owner'])
  const exists = lists.filter(element => element.slug === data.slug)

  if (exists.length >= 1) {
    throw new UserInputError('Cant update list when using same slug with other list')
  }

  list.owner = user
  list.title = data.title
  list.slug = data.slug
  // wrap(list).assign(data)
  await em.flush()
  return list
}

export async function deleteListAction (id: string, user: User, em: EntityManager): Promise<boolean> {
  const list = await em.findOneOrFail(List, { id })

  // todo check if logged user is owner

  if (user.id !== list.owner.id) {
    throw new AuthenticationError('Logged in user must be also the owner to delete a list')
  }

  await em.removeAndFlush(list)

  return true
}

export async function cloneListAction (id: string, em: EntityManager): Promise<List> {
  const oldList = await em.findOneOrFail(List, { id }, ['tasks', 'owner'])
  const newList = em.create(List, {})

  newList.capacity = oldList.capacity
  newList.owner = oldList.owner
  newList.slug = oldList.slug + String(Math.floor(Math.random() * 100 + 1)) // todo check that new slug is < 25
  newList.title = oldList.title
  newList.type = oldList.type

  await em.persistAndFlush(newList)
  // tasks implementation
  // todo tasks with map() or foreach()

  oldList.tasks.getItems().map((task) => {
    const newTask = em.create(Tasks, {
      name: task.name,
      type: task.type,
      list: newList,
      done: false
    })
    em.persist(newTask)

    return newTask
  })

  await em.flush()

  return newList
}
