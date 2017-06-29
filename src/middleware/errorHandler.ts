import { IRouterContext } from 'koa-router';

import { ContextualLogger } from '../contextualLogger';
import ctxLogger from '../logger';

type ResponseStatus = 'ok' | 'error';

/**
 * Simple HTTP response
 */
interface SimpleResponse {
  readonly status: ResponseStatus;
  readonly message?: string;
}

/**
 * ApplicationError, understood by error handler
 */
interface ApplicationError {
  readonly status: number;
  readonly body: SimpleResponse;
}

/**
 * Handle error response from database operation.
 *
 * @param logger Logger to bind to scope
 * @return Function expecting router context and returning function expecting an error
 */
/* tslint:disable-next-line:no-any */
const handleError: (logger?: ContextualLogger) => (ctx: IRouterContext) => (err: ApplicationError | any) => void =
  (logger) =>
    (ctx) =>
      (err) => {
        // ApplicationError has these but is just interface so cannot do instanceof
        if (err && err.status && err.body) {
          ctx.status = err.status;
          ctx.body = err.body;
        } else {
          logger && logger.error(ctx, 'Internal server error', err);
          const payload: SimpleResponse = {
            status: 'error',
            message: err && err.message ? err.message : null
          };
          ctx.status = 500;
          ctx.body = payload;
        }
      };

/* tslint:disable-next-line:no-any */
const errorHandler: (ctx: IRouterContext) => (err: ApplicationError | any) => void = handleError(ctxLogger);

export default errorHandler;

export {
  ApplicationError,
  SimpleResponse,
  ResponseStatus,

  errorHandler
};
