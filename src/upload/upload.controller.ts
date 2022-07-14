import {
  Controller,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/lib/multer.options';
import { UploadService } from './upload.service';

@ApiTags('파일 업로드 API')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary: '파일 업로드 API',
    description: '파일을 업로드 합니다.',
  })
  @UseInterceptors(FilesInterceptor('images', null, multerOptions))
  @Post()
  public uploadFiles(@UploadedFiles() files: File[]) {
    const uploadedFiles: string[] = this.uploadService.uploadFiles(files);

    return {
      status: HttpStatus.CREATED,
      message: 'files upload success',
      data: {
        files: uploadedFiles,
      },
    };
  }
}
