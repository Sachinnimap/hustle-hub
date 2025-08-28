import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BusinessException } from '../common/exceptions/bussiness.exception';
// import { UnauthorizedException } from '../common/exceptions/unauthorized.exception';
import { Response } from '../common/utils/response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {


  constructor() { }

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let errorResponse = new Response(500,'something went wrong')
    const exceptionMsg = (exception as any)?.response?.message || (exception as any)?.message;

    console.log("exception",exception)
    if (exception instanceof HttpException) {
      errorResponse = new Response(exception.getStatus(), exceptionMsg)
    } else if (exception instanceof BusinessException) {
      errorResponse =  new Response(400,exceptionMsg)
    } 

    if (errorResponse.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log("INTERNAL SERVER ERROR")
    }
    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
