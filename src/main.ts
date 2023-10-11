import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

// import { cpus } from 'os';
// import cluster from 'node:cluster';
//
// function scheduleGc() {
//   if (!global.gc) {
//     console.log('Garbage collection is not exposed');
//     return;
//   }
//
//   const nextCall = 30 + Math.random() * 15;
//
//   setTimeout(() => {
//     global.gc();
//     scheduleGc();
//   }, nextCall * 1000);
// }
//
// scheduleGc();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });
  await app.listen(3000, '0.0.0.0');
  // app.getHttpServer().keepAliveTimeout = 76 * 1000;
  // app.getHttpServer().headersTimeout = 77 * 1000; // This should be bigger than `keepAliveTimeout + your server's expected response time`
}

// if (cluster.isPrimary) {
//   const numCPUs = cpus().length;
//
//   console.log('Primary cluster setting up ' + numCPUs + ' workers...');
//
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//
//   cluster.on('online', function (worker) {
//     console.log('Worker ' + worker.process.pid + ' is online');
//   });
//
//   cluster.on('exit', function (worker, code, signal) {
//     console.log(
//       'Worker ' +
//         worker.process.pid +
//         ' died with code: ' +
//         code +
//         ', and signal: ' +
//         signal,
//     );
//     console.log('Starting a new worker');
//     cluster.fork();
//   });
// } else {
bootstrap();
// }
