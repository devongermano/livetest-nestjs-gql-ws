import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
export class Message {
  @Field()
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}
