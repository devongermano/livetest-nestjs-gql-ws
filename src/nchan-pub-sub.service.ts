// import { Injectable, OnModuleDestroy } from '@nestjs/common';
// import WebSocket from 'ws';
// import { EventEmitter } from 'events';
// import { PubSubEngine } from 'graphql-subscriptions';
//
// @Injectable()
// export class NchanPubSub implements PubSubEngine, OnModuleDestroy {
//   private readonly nchanServerUrl = 'nchan';
//   private ws: WebSocket | null = null;
//   private emitter = new EventEmitter();
//   private currentSubscriptionId: number = 0;
//   private subscriptions: Map<
//     number,
//     { trigger: string; listener: (...args: any[]) => void }
//   > = new Map();
//
//   constructor() {
//     this.initWebSocketConnection();
//   }
//
//   private initWebSocketConnection(): void {
//     this.ws = new WebSocket(`ws://${this.nchanServerUrl}/graphql`, {
//       perMessageDeflate: false,
//     });
//
//     this.ws.on('message', (data) => {
//       const payload = JSON.parse(data.toString());
//       this.emitter.emit(payload.trigger, payload);
//     });
//
//     this.ws.on('open', () => {
//       console.log(`WebSocket connection established.`);
//       // Set an interval to send ping messages every 30 seconds
//       const pingInterval = setInterval(() => {
//         if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//           this.ws.ping(() => {});
//         }
//       }, 30000);
//
//       this.ws.on('close', () => {
//         clearInterval(pingInterval); // Clear the interval when the socket is closed
//       });
//     });
//
//     this.ws.on('pong', () => {
//       console.log('Received pong response');
//     });
//
//     this.ws.on('error', (error) => {
//       console.error(`WebSocket error:`, error);
//     });
//
//     this.ws.on('close', (code, reason) => {
//       console.log(`WebSocket closed. Code: ${code}, Reason: ${reason}`);
//       // Reconnect logic here. Maybe use an increasing delay.
//       setTimeout(() => this.initWebSocketConnection(), 1000);
//     });
//   }
//
//   // async publish<T>(trigger: string, payload: T): Promise<void> {
//   //   await axios.post(`http://${this.nchanServerUrl}/pub?id=${trigger}`, {
//   //     ...payload,
//   //     trigger,
//   //   });
//   // }
//
//   async publish<T>(trigger: string, payload: T): Promise<void> {
//     if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//       this.ws.send(
//         JSON.stringify({
//           type: 'publish',
//           trigger,
//           payload,
//         }),
//       );
//     } else {
//       console.error('WebSocket is not ready or not connected.');
//       // Handle this case, maybe retry or queue the message.
//     }
//   }
//
//   async subscribe<T = any>(
//     trigger: string,
//     onMessage: (message: T) => void,
//   ): Promise<number> {
//     const subscriptionId = this.currentSubscriptionId++;
//     this.subscriptions.set(subscriptionId, { trigger, listener: onMessage });
//     this.emitter.on(trigger, onMessage);
//     return subscriptionId;
//   }
//
//   async unsubscribe(subId: number): Promise<void> {
//     const subscription = this.subscriptions.get(subId);
//     if (subscription) {
//       this.emitter.removeListener(subscription.trigger, subscription.listener);
//       this.subscriptions.delete(subId);
//     }
//   }
//
//   asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
//     const eventName =
//       typeof triggers === 'string' ? triggers : triggers.join('&');
//     return {
//       next(): Promise<IteratorResult<T, any>> {
//         return new Promise<IteratorResult<T, any>>((resolve) => {
//           this.emitter.once(eventName, (value) =>
//             resolve({ value, done: false }),
//           );
//         });
//       },
//       return(): Promise<IteratorResult<T, any>> {
//         this.emitter.removeAllListeners(eventName);
//         return Promise.resolve({ value: undefined, done: true });
//       },
//       throw(error: Error): Promise<IteratorResult<T, any>> {
//         return Promise.reject(error);
//       },
//     };
//   }
//
//   onModuleDestroy(): void {
//     this.ws?.close();
//     this.emitter.removeAllListeners();
//   }
// }
