import { IMiddleware, IRouterContext } from 'koa-router';

import { ContextualLogger } from '../contextualLogger';

/**
 * HTTP Status ranges
 */
enum HttpStatus {
  ApplicationError = 400,
  ServerError = 500
}

type LogLevel = 'error' | 'warn' | 'info';

/**
 * Use different log levels for different HTTP statuses
 *
 * @param status HTTP status code
 * @return The log level to use
 */
const statusToLevel: (status: number) => LogLevel =
  (status) => {
    if (status >= HttpStatus.ServerError) {
      return 'error';
    } else if (status >= HttpStatus.ApplicationError) {
      return 'warn';
    } else {
      return 'info';
    }
  };

/**
 * Construct Apache-like log string from context
 *
 * ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent
 *
 * @param ctx
 * @returns The string to log
 */
/* tslint:disable:no-string-literal */
const apachyLogString: (ctx: IRouterContext) => string =
  (ctx) =>
    [
      `"${ctx.method} ${ctx.url} HTTP/${ctx.req.httpVersion}"`,
      ctx.status,
      ctx.response.length,
      `"${ctx.req.headers['referer'] || ctx.req.headers['referrer']}"`,
      `"${ctx.req.headers['user-agent']}"`
    ]
    .join(' ');

/* tslint:enable:no-string-literal */

/**
 * Simple logging middleware for Koa since none of the existing ones
 * seemed to do what was needed to get readable logs with request ID.
 */
const koaLogger: (logger: ContextualLogger) => IMiddleware =
  (logger) =>
    async(ctx: IRouterContext, next: Function) => {
      const startAt: [number, number] = process.hrtime();

      await next();

      const endAt: [number, number] = process.hrtime();
      const ms: number = (startAt[0] - endAt[0]) * 1e3 + (startAt[1] - endAt[1]) * 1e-6;

      const msg: string = [
        ctx.request.ip,
        apachyLogString(ctx),
        `${ms.toFixed(3)} ms`
      ].join(' - ');

      logger[statusToLevel(ctx.status)](ctx, msg);
    };

export default koaLogger;

export { koaLogger };
