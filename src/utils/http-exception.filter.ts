import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

//Catch Annotation -> Binding ExceptionFilter to require meta data
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   *
   * @param exception
   * @param host - ex) req, res, next
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res: any = exception.getResponse();

    const url: string = request.url;
    const error: string = res.error;
    const timestamp: string = new Date().toISOString();

    response.status(status).json({
      success: false,
      message: res.message,
    });
  }
}
