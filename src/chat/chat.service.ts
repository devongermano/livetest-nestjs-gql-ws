import { Injectable } from '@nestjs/common';
// import { NchanPubSub } from '../nchan-pub-sub.service';
// import { megaPubSub } from './chat.resolver';

@Injectable()
export class ChatService {
  constructor() {} // private readonly nchanPubSubService: NchanPubSub,

  // async sendChatMessage(message: any): Promise<any> {
  //   try {
  //     await megaPubSub.publish('messageAdded', message);
  //     console.log('puslishe messagew wow');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
