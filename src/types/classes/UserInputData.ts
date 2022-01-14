import { IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class UserInputData {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  email: string
}
