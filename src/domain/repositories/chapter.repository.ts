import { Chapter } from "../entities/chapter.entity";

export interface ChapterRepository {
  create(chapter: Chapter): Promise<Chapter>;
  findByNovelId(novelId: string): Promise<Chapter[]>;
}
