import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {  // 인터셉터는 @nestjs/common 패키지에서 제공하는 NestInterceptor 인터페이스를 구현한 클래스이다.
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {  // NestInterceptor 인터페이스의 intercept 함수를 구현해야 함.
    // console.log('Before...'); // 요청이 전달되기 전 로그를 출력
    // const now = Date.now();

    const { method, url, body } = context.getArgByIndex(0); // 실행 콘텍스트에 포함된 첫 번째 객체를 얻어옵니다. 이 객체로부터 요청 정보를 얻을 수 있습니다.
    this.logger.log(`Request to ${method} ${url}`); // 요청의 HTTP 메서드와 URL을 로그로 출력

    return next
      .handle()
      .pipe(
        // tap(() => console.log(`After... ${Date.now() - now}ms`)), // 요청을 처리한 후 로그를 출력
        tap(data => this.logger.log(`Response from ${method} ${url} \n response: ${JSON.stringify(data)}`)) // 응답 로그에도 HTTP 메서드와 URL과 함께 응답결과를 함께 출력
      ) ;
  }
}