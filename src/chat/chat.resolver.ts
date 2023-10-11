import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Message } from './message.entity';
import { CreateMessageInput } from './create-message-input.dto';
// import { PubSub } from 'graphql-subscriptions';
import { RedisPubSubService } from '../redis-pub-sub.service';

// export const megaPubSub: PubSub = new PubSub();

@Resolver(() => Message)
export class ChatResolver {
  constructor(private redisPubSub: RedisPubSubService) {}

  @Query(() => [Message])
  async messages() {
    return [];
  }

  @Mutation(() => Message)
  async createMessage(
    @Args('input') input: CreateMessageInput,
  ): Promise<Message> {
    console.log('creating message');
    const message: Message = {
      id: Date.now().toString(),
      user: { id: input.userId, username: 'Test User' }, // This should come from a real user service
      content: input.content,
      createdAt: new Date(),
    };

    console.log('message created', message);

    // await megaPubSub.publish('messageAdded', { messageAdded: message });
    await this.redisPubSub.publish('messageAdded', { messageAdded: message });
    return message;
  }

  @Subscription(() => Message)
  messageAdded() {
    console.log('subscription active');
    const triggerName = 'messageAdded'; // Name of the channel
    console.log('sub happend!');
    return this.redisPubSub.asyncIterator(triggerName);
    // return megaPubSub.asyncIterator(triggerName);
  }
}
