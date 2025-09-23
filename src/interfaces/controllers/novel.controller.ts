import { Elysia, t } from "elysia";
import { DrizzleNovelRepository } from "../../infrastructure/repositories/drizzle-novel.repository";
import { LocalFileStorageAdapter } from "../../infrastructure/adapters/local-file-storage.adapter";
import { CreateNovelUseCase } from "@/application/use-cases/novel/create-novel-use-case";
import { betterAuthPlugin } from "@/infrastructure/http/plugins/better-auth";

const novelRepo = new DrizzleNovelRepository();
const fileStorage = new LocalFileStorageAdapter();
const createNovelUseCase = new CreateNovelUseCase(novelRepo, fileStorage);

export const novelRoutes = new Elysia()
  .use(betterAuthPlugin)
  .post(
    "/novels",
    async ({ body, user }) => {
      const novel = await createNovelUseCase.execute({
        title: body.title,
        description: body.description,
        genres: body.genres?.split(",") ?? [],
        coverFile: body.coverFile,
        userId: user.id,
      });

      return { success: true, novel };
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        genres: t.Optional(t.String()),
        coverFile: t.Optional(
          t.File({
            type: ["image/jpeg", "image/png"],
            maxSize: "5m",
          })
        ),
      }),
      auth: true,
      detail: {
        summary: "Create a new novel",
        tags: ["Novel"],
      },
    }
  )
  .get(
    "/novels/:id",
    async ({ params }) => {
      const novel = await novelRepo.findById(params.id);
      if (!novel) {
        return { success: false, message: "Novel not found" };
      }
      return { success: true, novel };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get a novel by ID",
        tags: ["Novel"],
      },
    }
  );
