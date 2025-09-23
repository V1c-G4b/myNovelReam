export interface FileStorageAdapter {
  upload(file: File, novelId:string): Promise<{filePath: string; fileSize: number; fileType: string;}>;
}