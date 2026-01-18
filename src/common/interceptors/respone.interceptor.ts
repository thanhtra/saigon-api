import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    success: boolean;
    message: string;
    code: string;
    result: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler,): Observable<Response<T>> {
        return next.handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    success: data?.success,
                    message: data?.message,
                    result: data?.data,
                    code: data?.code
                })),
            );
    }
}