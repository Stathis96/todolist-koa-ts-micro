import { registerEnumType } from 'type-graphql'

export enum TypeOfWork {
  WORK = 'work',
  PERSONAL = 'personal',
  FUN = 'fun',
}

registerEnumType(TypeOfWork, {
  name: 'WorkType' // this one is mandatory
})
