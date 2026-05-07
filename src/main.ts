import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";

import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyStatic, {
    root: join(__dirname, "..", "uploads"),
    prefix: "/upload/",
  });

  await app.register(multipart);

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
