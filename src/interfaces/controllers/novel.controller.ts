import { CreateNovelUseCase } from "@/application/use-cases/novel/create-novel-use-case";
import { betterAuthPlugin } from "@/infrastructure/http/plugins/better-auth";
import { Elysia, t } from "elysia";
import { LocalFileStorageAdapter } from "../../infrastructure/adapters/local-file-storage.adapter";
import { DrizzleNovelRepository } from "../../infrastructure/repositories/drizzle-novel.repository";

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
    "/novels/:novelId",
    async ({ params }) => {
      const novel = await novelRepo.findById(params.novelId);
      if (!novel) {
        return { success: false, message: "Novel not found" };
      }
      return { success: true, novel };
    },
    {
      params: t.Object({
        novelId: t.String(),
      }),
      detail: {
        summary: "Get a novel by ID",
        tags: ["Novel"],
      },
    }
  )
  .get(
    "/novels",
    async () => {
      const novels = await novelRepo.getAll();
      return { success: true, novels };
    },
    {
      detail: {
        summary: "Get all novels",
        tags: ["Novel"],
      },
    }
  );
