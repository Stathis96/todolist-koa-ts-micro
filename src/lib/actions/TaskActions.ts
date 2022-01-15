import { EntityManager } from '@mikro-orm/core'
import { AuthenticationError, UserInputError } from 'apollo-server-koa'
import { TasksInputData } from 'src/types/classes/TasksInputData'
import { List } from 'src/types/entities/List'
import { Tasks } from 'src/types/entities/Tasks'
import { User } from 'src/types/entities/User'

export async function createTaskAction (data: TasksInputData, user: User, em: EntityManager): Promise<Tasks> {
  // const pastTasks = await em.find(Tasks, {})
  // const list = await em.findOneOrFail(List, {id: data.list_id}, ['tasks'])

  const list = await em.findOneOrFail(List, { id: data.list_id }, ['tasks'])
  const exists = list.tasks.getItems().find(({ name }) => name === data.name)

  // todo check if logged is owner
  if (user.id !== list.owner.id) {
    throw new AuthenticationError('Logged in user must be also the owner to create a task')
  }
  // let x = true
  // pastTasks.forEach(task => {
  //   console.log("task name", task.name );
  //   console.log("data name", data.name);
  //   if (task.name === data.name)
  //   x = false
  // })
  if (data.type !== list.type) {
    throw new UserInputError('Task type and List type must match!!')
  }
  if (list.capacity <= list.tasks.length) {
    throw new UserInputError('List is full!!')
  }
  if (exists) {
    throw new UserInputError('Cant use same name for taskname')
  }

  const task = em.create(Tasks, { ...data, list: list })

  await em.persistAndFlush(task)
  return task
}

export async function updateTaskAction (id: string, data: TasksInputData, user: User, em: EntityManager): Promise<Tasks> {
  const task = await em.findOneOrFail(Tasks, { id })
  // todo check if logged is owner

  const list = await em.findOneOrFail(List, { id: data.list_id }, ['tasks'])

  if (user.id !== list.owner.id) {
    throw new AuthenticationError('Logged in user must be also the owner to update a task')
  }
  const exists = list.tasks.getItems().find(({ name }) => name === data.name)
  // console.log('Show me the tasks', list.tasks)
  if (exists) {
    throw new UserInputError('Cannott use same name for taskname with existing one')
  }

  task.list = list
  task.type = data.type
  task.name = data.name
  task.done = data.done
  // wrap(task).assign(data)
  await em.flush()
  return task
}

export async function deleteTaskAction (id: string, user: User, em: EntityManager): Promise<boolean> {
  const task = await em.findOneOrFail(Tasks, { id })

  const list = await em.findOneOrFail(List, { id: task.list.id }, ['tasks'])
  // todo check if logged is owner
  if (user.id !== list.owner.id) {
    throw new AuthenticationError('Logged in user must be also the owner to delete a task')
  }
  await em.removeAndFlush(task)
  console.log('Task removed')
  return true // todo test
}
