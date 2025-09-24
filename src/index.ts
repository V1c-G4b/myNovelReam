import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { runMigrations } from "./infrastructure/db/run-migrations";
import { userController } from "./infrastructure/http/controller/user-controller";
import {
  betterAuthPlugin,
  OpenAPI,
} from "./infrastructure/http/plugins/better-auth";
import { chapterRoutes } from "./interfaces/controllers/chapter.controller";
import { novelRoutes } from "./interfaces/controllers/novel.controller";
import staticPlugin from "@elysiajs/static";

const PORT = Number(process.env.PORT) || 3000;

await runMigrations().catch((err) => {
  console.error("Falha ao executar migrações:", err);
  process.exit(1);
});

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      origin: "http://localhost:5173",
    })
  ).use(staticPlugin({
    assets: "uploads", 
    prefix: "/uploads" 
  }))
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(betterAuthPlugin)
  .use(novelRoutes)
  .use(chapterRoutes)
  .use(userController)
  .get("/", () => "Hello Elysia")
  .get("/health", () => ({ status: "ok" }));

app.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
