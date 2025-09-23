import { Novel } from "@/domain/entities/novel.entity";
import { NovelRepository } from "@/domain/repositories/novel.repository";
import { novels as novelsTable } from "@/infrastructure/persistence/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/client";

export class DrizzleNovelRepository implements NovelRepository {
  async create(novel: Novel): Promise<Novel> {
    const [inserted] = await db
      .insert(novelsTable)
      .values({
        id: novel.id,
        title: novel.title,
        description: novel.description,
        authorId: novel.authorId,
        genres: novel.genres,
        coverImagePath: novel.coverImagePath,
        createdAt: novel.createdAt,
        updatedAt: novel.updatedAt,
      })
      .returning();

    return new Novel(
      inserted.id,
      inserted.title,
      inserted.authorId,
      inserted.description ?? "",
      inserted.genres ?? [],
      inserted.coverImagePath ?? "",
      inserted.createdAt,
      inserted.updatedAt
    );
  }
  async findById(id: string): Promise<Novel | null> {
    const results = await db
      .select()
      .from(novelsTable)
      .where(eq(novelsTable.id, id));
    if (results.length === 0) return null;

    const r = results[0];
    return new Novel(
      r.id,
      r.title,
      r.authorId,
      r.description ?? "",
      r.genres ?? [],
      r.coverImagePath ?? "",
      r.createdAt,
      r.updatedAt
    );
  }
}
