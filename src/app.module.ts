import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ChatResolver } from './chat/chat.resolver';
import { RedisPubSubService } from './redis-pub-sub.service';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { makeBehavior } from 'graphql-ws/lib/use/uWebSockets';
import { execute, subscribe } from 'graphql/execution';
import * as uWS from 'uWebSockets.js';
import { ApolloServer } from '@apollo/server';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      typePaths: ['**/*.graphql'],
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatResolver, RedisPubSubService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly graphQLModule: GraphQLModule) {}

  onModuleInit() {
    const { schema } = this.graphQLModule.options;

    const behavior = makeBehavior({
      schema,
      execute,
      subscribe,
      onConnect: (ctx) => {
        console.log('Client connected:', ctx);
      },
    });

    uWS
      .App()
      .ws('/graphql', behavior)
      .any('/*', (res, req) => {
        // ... handle HTTP requests
      })
      .listen(4000, (token) => {
        if (token) {
          console.log('Server started on http://localhost:4000');
        } else {
          console.log('Failed to start server');
        }
      });
  }
}
