import { FileStorageAdapter } from "@/domain/adapters/file-storage.adapter";
import { Novel } from "@/domain/entities/novel.entity";
import { NovelRepository } from "@/domain/repositories/novel.repository";

export class CreateNovelUseCase {
  constructor(
    private novelRepo: NovelRepository,
    private fileStorage: FileStorageAdapter
  ) {}

  async execute(input: {
    title: string;
    description?: string;
    genres?: string[];
    coverFile?: File; // Opcional: arquivo de capa
    userId: string; // De auth
  }): Promise<Novel> {
    let coverImagePath: string | undefined;

    // Upload capa se fornecido
    if (input.coverFile) {
      const tempNovelId = crypto.randomUUID(); // ID temp para pasta; atualize após criação se preciso
      const { filePath } = await this.fileStorage.upload(
        input.coverFile,
        tempNovelId
      );
      coverImagePath = filePath;
    }

    // Crie entidade
    const novel = new Novel(
      crypto.randomUUID(),
      input.title,
      input.description ?? "",
      input.userId,
      input.genres ?? [],
      coverImagePath ?? ""
    );
    novel.validate();

    // Persista
    return this.novelRepo.create(novel);
  }
}
