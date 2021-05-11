interface FileUploaderOptions {
  onFileAdded?: (file: File) => void;
}

export class FileUploader {
  public queue: File[] = [];
  constructor(private config: FileUploaderOptions) {

  }

  public addToQueue(files: File[]): void {

    for (const file of files) {
      this.queue.push(file);

      if (this.config.onFileAdded) {
        this.config.onFileAdded(file);
      }
    }
  }
}
