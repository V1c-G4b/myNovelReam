import { FileStorageAdapter } from "@/domain/adapters/file-storage.adapter";
import { Chapter } from "@/domain/entities/chapter.entity";
import { ChapterRepository } from "@/domain/repositories/chapter.repository";
import { NovelRepository } from "@/domain/repositories/novel.repository";

export class CreateChapterUseCase {
  constructor(
    private chapterRepo: ChapterRepository,
    private novelRepo: NovelRepository,
    private fileStorage: FileStorageAdapter
  ) {}

  async execute(input: {
    novelId: string;
    title: string;
    file: File;
    order: number;
    userId: string;
  }) {
    const novel = await this.novelRepo.findById(input.novelId);

    if (!novel) throw new Error("Novel not found");
    if (novel.authorId !== input.userId)
      throw new Error("You are not the author of this novel");

    const { filePath, fileSize, fileType } = await this.fileStorage.upload(
      input.file,
      input.novelId
    );

    const existingChapter = await this.chapterRepo.findByNovelId(input.novelId);
    const nextOrder =
      input.order ?? Math.max(...existingChapter.map((c) => c.order), 0) + 1;

    const chapter = new Chapter(
      crypto.randomUUID(),
      input.novelId,
      input.title,
      filePath,
      fileType,
      fileSize,
      nextOrder
    );

    chapter.validate();

    return this.chapterRepo.create(chapter);
  }
}
