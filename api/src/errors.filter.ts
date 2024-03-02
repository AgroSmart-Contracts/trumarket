import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { HttpError } from './errors'
import { logger } from './logger'

@Catch()
export class ErrorsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorsFilter.name)

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof HttpError ? exception.statusCode : HttpStatus.INTERNAL_SERVER_ERROR

    const httpMessage =
      exception instanceof HttpError
        ? exception.message
        : new InternalServerErrorException().message

    if (exception instanceof HttpError && exception.statusCode < 500) {
      logger.warn(exception.message, exception.stack)
    } else if (exception instanceof Error) {
      logger.error(exception, exception.message)
    }

    const responseBody = {
      statusCode: httpStatus,
      message: httpMessage,
    }

    // eslint-disable-next-line
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
