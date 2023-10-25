import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators"

export interface Respnse<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Respnse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Respnse<T>> {
    return next
      .handle()
      .pipe(map(data => {
        return { data }
      }));
  }
}