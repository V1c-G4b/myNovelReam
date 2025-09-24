import { StringFormatParams } from "better-auth/*";

export class Chapter {
  constructor(
    public id: string,
    public novelId: string,
    public title: string,
    public filePath: string,
    public fileType: string,
    public fileSize: number,
    public order: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  validate() {
    if (!this.title) throw new Error("Title is required");
    if (!["pdf", "doc", "docx"].includes(this.fileType))
      throw new Error("Invalid file type" + this.fileType);
  }
}
