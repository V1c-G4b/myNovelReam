export class Novel {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public authorId: string,
    public genres: string[],
    public coverImagePath: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  validate() {
    if (!this.title) throw new Error("Title is required");
    if (!this.description) throw new Error("Description is required");
    if (!this.authorId) throw new Error("Author ID is required");
    if (!this.genres || this.genres.length === 0)
      throw new Error("At least one genre is required");
    if (!this.coverImagePath) throw new Error("Cover image path is required");
  }
}
