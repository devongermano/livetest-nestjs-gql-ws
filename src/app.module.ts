import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ChatResolver } from './chat/chat.resolver';
import { RedisPubSubService } from './redis-pub-sub.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatResolver, RedisPubSubService],
})
export class AppModule {}
// implements OnModuleInit {
//   constructor(private readonly graphQL: Graph) {}
//
//   async onModuleInit() {
//
//     this.graphQL.
//     // const { schema } = this.graphQLModule.options;
//     const schema = await this.graphQLModule.graphQlAdapter.generateSchema({
//       typePaths: ['**/*.graphql'],
//       autoSchemaFile: true,
//     });
//
//     const behavior = makeBehavior({
//       schema,
//       execute,
//       subscribe,
//       onConnect: (ctx) => {
//         console.log('Client connected:', ctx);
//       },
//     });
//
//     uWS
//       .App()
//       .ws('/graphql', behavior)
//       .any('/*', (res, req) => {
//         // ... handle HTTP requests
//       })
//       .listen(4000, (token) => {
//         if (token) {
//           console.log('Server started on http://localhost:4000');
//         } else {
//           console.log('Failed to start server');
//         }
//       });
//   }
// }
