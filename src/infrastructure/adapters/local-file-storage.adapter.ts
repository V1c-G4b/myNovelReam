import { FileStorageAdapter } from "@/domain/adapters/file-storage.adapter";
import * as path from "path";
import * as fs from "fs/promises";

export class LocalFileStorageAdapter implements FileStorageAdapter {
  async upload(
    file: File,
    novelId: string
  ): Promise<{ filePath: string; fileSize: number; fileType: string }> {
    const ext = path.extname(file.name).slice(1);

    if (!["png", "jpg", "jpeg", "gif", "pdf", "doc", "docx"].includes(ext))
      throw new Error("Invalid file type");

    const fileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "uploads", novelId);
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    
    return {
      filePath: `/uploads/${novelId}/${fileName}`,
      fileSize: file.size,
      fileType: ext,
    };
  }
}
