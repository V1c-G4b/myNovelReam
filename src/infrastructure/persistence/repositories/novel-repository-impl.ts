// src/infrastructure/persistence/repositories/novel-repository-impl.ts

import { Novel } from "@/domain/novel/novel";
import { NovelRepository } from "@/domain/novel/novel-repository";
import { db } from "@/infrastructure/db/client";
import { novels } from "@/infrastructure/persistence/schema/novel";
import { desc, eq } from "drizzle-orm";

export class NovelRepositoryImpl implements NovelRepository {
  async save(novel: Novel): Promise<void> {
    await db.insert(novels).values({
      id: novel.id,
      title: novel.title,
      description: novel.description,
      genres: novel.genres,
      authorId: novel.authorId,
      createdAt: novel.createdAt,
      updatedAt: novel.updatedAt,
    });
  }
  async findAll(): Promise<Novel[]> {
    const rows = await db.select().from(novels);
    return rows.map(
      (row) =>
        new Novel({
          id: row.id,
          title: row.title,
          description: row.description ?? undefined,
          genres: row.genres ?? [],
          authorId: row.authorId,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        })
    );
  }

  async findById(id: string): Promise<Novel | null> {
    const rows = await db.select().from(novels).where(eq(novels.id, id));
    const row = rows[0];
    if (!row) return null;
    return new Novel({
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      genres: row.genres ?? [],
      authorId: row.authorId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByAuthor(authorId: string): Promise<Novel[]> {
    const rows = await db
      .select()
      .from(novels)
      .where(eq(novels.authorId, authorId))
      .orderBy(desc(novels.createdAt));
    if (!rows) return [];
    return rows.map(
      (row) =>
        new Novel({
          id: row.id,
          title: row.title,
          description: row.description ?? undefined,
          genres: row.genres ?? [],
          authorId: row.authorId,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        })
    );
  }
}
