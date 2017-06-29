import { IMiddleware, IRouterContext } from 'koa-router';
import * as UUID from 'uuid/v4';

/**
 * Generate a session ID and add it to request headers for two reasons:
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
