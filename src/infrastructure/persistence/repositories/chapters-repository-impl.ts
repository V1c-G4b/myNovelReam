// src/infrastructure/persistence/repositories/chapters-repository-impl.ts

import { Chapter } from "@/domain/chapters/chapter";
import { ChapterRepository } from "@/domain/chapters/chapter-repository";
import { db } from "@/infrastructure/db/client";
import { chapters } from "@/infrastructure/persistence/schema/novel";
import { desc, eq, max } from "drizzle-orm";

export class ChapterRepositoryImpl implements ChapterRepository {
  async save(chapter: Chapter): Promise<void> {
    await db.insert(chapters).values({
      id: chapter.id,
      novelId: chapter.novelId,
      title: chapter.title,
      content: chapter.content,
      order: chapter.order,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    });
  }

  async update(chapter: Chapter): Promise<void> {
    await db
      .update(chapters)
      .set({
        title: chapter.title,
        content: chapter.content,
        order: chapter.order,
        updatedAt: chapter.updatedAt,
      })
      .where(eq(chapters.id, chapter.id));
  }

  async findById(id: string): Promise<Chapter | null> {
    const rows = await db.select().from(chapters).where(eq(chapters.id, id));
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async findByNovel(novelId: string): Promise<Chapter[]> {
    const rows = await db
      .select()
      .from(chapters)
      .where(eq(chapters.novelId, novelId))
      .orderBy(chapters.order, desc(chapters.createdAt));
    return rows.map((r) => this.mapRow(r));
  }

  async nextOrderForNovel(novelId: string): Promise<number> {
    const rows = await db
      .select({ maxOrder: max(chapters.order) })
      .from(chapters)
      .where(eq(chapters.novelId, novelId));
    const maxOrder = rows[0]?.maxOrder ?? 0;
    return (maxOrder as number) + 1;
  }

  private mapRow(row: any): Chapter {
    return new Chapter({
      id: row.id,
      novelId: row.novelId,
      title: row.title,
      content: row.content,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
