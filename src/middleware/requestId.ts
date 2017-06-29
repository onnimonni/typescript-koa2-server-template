import { IMiddleware, IRouterContext } from 'koa-router';
import * as UUID from 'uuid/v4';

/**
 * Generate a session ID and add it to request headers for two reasons:
 *
 * 1. Eventually the ID will likely come in the header from the HTTP server
 * 2. koa-morgan only receives ctx.req so cannot use ctx.state
 *
 * @param ctx
 * @param next
 */
const requestId: (header: string) => IMiddleware =
  (header) =>
    async(ctx: IRouterContext, next: Function) => {
      ctx.req.headers[header] || (ctx.req.headers[header] = UUID());

      return await next();
    };

export default requestId;

export { requestId };
