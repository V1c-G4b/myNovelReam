import { CreateChapterUseCase } from "@/application/use-cases/chapters/create-chapter-use-case";
import { betterAuthPlugin } from "@/infrastructure/http/plugins/better-auth";
import { Elysia, t } from "elysia";
import { LocalFileStorageAdapter } from "../../infrastructure/adapters/local-file-storage.adapter";
import { DrizzleChapterRepository } from "../../infrastructure/repositories/drizzle-chapter.repository";
import { DrizzleNovelRepository } from "../../infrastructure/repositories/drizzle-novel.repository"; // Assuma implementado

const chapterRepo = new DrizzleChapterRepository();
const novelRepo = new DrizzleNovelRepository();
const fileStorage = new LocalFileStorageAdapter();
const createChapterUseCase = new CreateChapterUseCase(
  chapterRepo,
  novelRepo,
  fileStorage
);

export const chapterRoutes = new Elysia().use(betterAuthPlugin).post(
  "/novels/:novelId/chapters",
  async ({ params, body, user }) => {
    if (!user) throw new Error("Unauthorized");

    const chapter = await createChapterUseCase.execute({
      novelId: params.novelId,
      title: body.title ?? "Untitled Chapter",
      file: body.file,
      order: body.order ?? 0,
      userId: user.id,
    });

    return { success: true, chapter };
  },
  {
    type: "multipart/form-data",
    params: t.Object({
      novelId: t.String(),
    }),
    body: t.Object({
      title: t.Optional(t.String()),
      file: t.File(),
      order: t.Optional(t.Number()),
    }),
    auth: true,
  }
);
