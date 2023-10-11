import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  userId: string;

  @Field()
  content: string;
}
