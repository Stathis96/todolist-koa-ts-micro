import { IsBoolean, IsEnum, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

import { TypeOfWork } from '../enums/TypeOfWork'

@InputType()
export class TasksInputData {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsEnum(TypeOfWork)
  type: TypeOfWork

  @Field()
  @IsString()
  list_id: string

  @Field({ nullable: true })
  @IsBoolean()
  done: boolean
}
