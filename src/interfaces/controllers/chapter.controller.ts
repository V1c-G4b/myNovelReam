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

export const chapterRoutes = new Elysia()
  .use(betterAuthPlugin)
  .post(
    "/novels/:novelId/chapters",
    async ({ params, body, user }) => {
      if (!user) throw new Error("Unauthorized");

      // Normalize and validate `order` which may come as a string when using multipart/form-data
      const rawOrder: any = body.order;
      let parsedOrder: number | undefined = undefined;

      if (rawOrder !== undefined && rawOrder !== null) {
        if (typeof rawOrder === "string") {
          const cleaned = (rawOrder as string).trim();
          if (cleaned === "") parsedOrder = undefined;
          else {
            const n = Number(cleaned);
            if (Number.isNaN(n) || !Number.isInteger(n)) {
              throw new Error("Invalid 'order' value: must be an integer");
            }
            parsedOrder = n;
          }
        } else if (typeof rawOrder === "number") {
          if (!Number.isInteger(rawOrder))
            throw new Error("Invalid 'order' value: must be an integer");
          parsedOrder = rawOrder;
        } else {
          throw new Error("Invalid 'order' value");
        }
      }

      const chapter = await createChapterUseCase.execute({
        novelId: params.novelId,
        title: body.title ?? "Untitled Chapter",
        file: body.file,
        // Pass `undefined` when not provided so the use-case will compute the next order
        order: parsedOrder,
        userId: user.id,
      });

      return { success: true, chapter };
    },
    {
      type: "multipart/form-data",
      params: t.Object({
        novelId: t.String(),
      }),
      // Accept order as number or string (multipart/form-data often sends values as strings)
      body: t.Object({
        title: t.Optional(t.String()),
        file: t.File(),
        order: t.Optional(t.Union([t.Number(), t.String()])),
      }),
      auth: true,
      detail: {
        summary: "Create a new chapter for a specific novel",
        tags: ["Chapter"],
      },
    }
  )
  .get(
    "/novels/:novelId/chapters",
    async ({ params }) => {
      const chapters = await chapterRepo.findByNovelId(params.novelId);
      return chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        order: ch.order,
        filePath: ch.filePath,
      }));
    },
    {
      auth: true,
      detail: {
        summary: "Get chapters for a specific novel",
        tags: ["Chapter"],
      },
      params: t.Object({
        novelId: t.String(),
      }),
    }
  );
