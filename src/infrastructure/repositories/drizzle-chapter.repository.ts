import { Chapter } from "@/domain/entities/chapter.entity";
import { chapters as chaptersTable } from "@/infrastructure/persistence/schema";
import { ChapterRepository } from "@/domain/repositories/chapter.repository";
import { db } from "../db/client";
import { eq } from "drizzle-orm";

export class DrizzleChapterRepository implements ChapterRepository {
  async create(chapter: Chapter): Promise<Chapter> {
    const [inserted] = await db
      .insert(chaptersTable)
      .values({
        id: chapter.id,
        novelId: chapter.novelId,
        title: chapter.title,
        filePath: chapter.filePath,
        fileType: chapter.fileType,
        fileSize: chapter.fileSize,
        order: chapter.order,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      })
      .returning();

    return new Chapter(
      inserted.id,
      inserted.novelId,
      inserted.title,
      inserted.filePath,
      inserted.fileType,
      inserted.fileSize ?? 0,
      inserted.order,
      inserted.createdAt,
      inserted.updatedAt
    );
  }

  async findByNovelId(novelId: string): Promise<Chapter[]> {
    const results = await db
      .select()
      .from(chaptersTable)
      .where(eq(chaptersTable.novelId, novelId))
      .orderBy(chaptersTable.order);

    return results.map(
      (r) =>
        new Chapter(
          r.id,
          r.novelId,
          r.title,
          r.filePath,
          r.fileType,
          r.fileSize ?? 0,
          r.order,
          r.createdAt,
          r.updatedAt
        )
    );
  }
}
