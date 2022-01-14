import { IsEnum, IsNumber, IsString, Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { TypeOfWork } from '../enums/TypeOfWork'

@InputType()
export class ListInputData {
  @Field()
  @Length(3, 25)
  @IsString()
  // @Matches('*')
  // todo match regex
  slug: string

  @Field()
  @IsString()
  title: string

  @Field()
  @IsEnum(TypeOfWork)
  type: TypeOfWork

  @Field()
  @IsNumber()
  capacity: number

  // @Field()
  // @IsString()
  // task_id: string

  // @Field()
  // @IsString()
  // owner_id: string
}
