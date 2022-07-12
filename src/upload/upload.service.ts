import { Injectable } from '@nestjs/common';
import { createImageURL } from 'src/lib/multer.options';

@Injectable()
export class UploadService {
  uploadFiles(files: File[]): string[] {
    const generatedFiles: string[] = [];

    for (const file of files) {
      generatedFiles.push(createImageURL(file));
    }

    return generatedFiles;
  }
}
