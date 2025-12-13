import {
  BadGatewayException,
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { EntityExistsException } from '../exceptions/entity-exists.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { ForbiddenActionException } from '../exceptions/forbidden-action.exception';

const errorOverridingStrategy = [
  {
    initial: EntityNotFoundError,
    target: NotFoundException,
  },
  {
    initial: QueryFailedError,
    target: ForbiddenException,
  },
  {
    initial: EntityExistsException,
    target: ConflictException,
  },
  {
    initial: EntityNotFoundException,
    target: NotFoundException,
  },
  {
    initial: ForbiddenActionException,
    target: ForbiddenException,
  },
  // To support additional types of exceptions just add them to this mapping
];

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        errorOverridingStrategy.forEach(({ initial, target }) => {
          if (error instanceof initial) {
            // @ts-ignore - the "detail" key exists in QueryFailedError, but is not mapped by TypeOrm: https://github.com/typeorm/typeorm/issues/6299
            error.message += error.detail ? ' - ' + error.detail : '';

            throw new target(error.message);
          }
        });
        throw error;
      }),
    );
  }
}
