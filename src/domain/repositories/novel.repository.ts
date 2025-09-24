import { Novel } from "../entities/novel.entity";

export interface NovelRepository {
  create(novel: Novel): Promise<Novel>;
  findById(id: string): Promise<Novel | null>;
  getAll(): Promise<Novel[]>;
}