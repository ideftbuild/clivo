import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import fastifyStatic from "@fastify/static";
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
    root: join(__dirname, "..", "upload"),
    prefix: "/upload/",
  });

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
