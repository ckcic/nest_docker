import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()  // 처리되지 않은 모든 예외를 잡으려고 할 때 사용하는 데커레이터
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {  // 대부분의 예외는 HttpException을 상속 받는 클래스들이다. 그것이 아닌 예외는 알 수 없는 에러이므로 InternalServerErrorException으로 처리
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const stack =  exception.stack;

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    }

    // console.log(log);
    this.logger.log(log);

    res
    .status((exception as HttpException).getStatus())
    .json(response);
  }
}