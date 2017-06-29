import { IRouterContext } from 'koa-router';
import * as R from 'ramda';
import * as Winston from 'winston';

/**
 * Limited Winston log method signature
 */
type LeveledLogMethod = (ctx: IRouterContext, msg: string, meta?: object) => Winston.LoggerInstance;

/**
 * Winston-like interface
 */
interface ContextualLogger {
  readonly debug: LeveledLogMethod;
  readonly verbose: LeveledLogMethod;
  readonly info: LeveledLogMethod;
  readonly warn: LeveledLogMethod;
  readonly error: LeveledLogMethod;
}

/**
 * Logger that requires a Koa context and logs request ID automatically
 *
 * @param reqIdHeader Header containing request ID
 * @param logger Configured winston instance used for logging
 * @return Logger wrapper where log level methods need `ctx` parameter
 */
const getContextualLogger: (reqIdHeader: string, logger: Winston.Winston) => ContextualLogger =
  (reqIdHeader, logger) => {
    const getId: (ctx: IRouterContext) => { readonly reqId: string } = (ctx) => ({
      reqId: ctx.req.headers[reqIdHeader] as string
    });

    const log: (ctx: IRouterContext, level: keyof ContextualLogger) => Winston.LeveledLogMethod =
      (ctx, level): Winston.LeveledLogMethod =>
        (msg: string, meta?: object): Winston.LoggerInstance => {
          if (meta instanceof Error) {
            // Error object does not serialize properly. Do it manually
            // so the request ID can be adde and still have something useful in meta
            meta = {
              name: meta.name,
              message: meta.message,
              stack: meta.stack
            };
          }

          return logger.log(level, msg, R.mergeAll([{}, meta, getId(ctx)]));
        };

    return {
      debug: (ctx: IRouterContext, msg: string, meta?: object) =>
        log(ctx, 'debug')(msg, meta),
      verbose: (ctx: IRouterContext, msg: string, meta?: object) =>
        log(ctx, 'verbose')(msg, meta),
      info: (ctx: IRouterContext, msg: string, meta?: object) =>
        log(ctx, 'info')(msg, meta),
      warn: (ctx: IRouterContext, msg: string, meta?: object) =>
        log(ctx, 'warn')(msg, meta),
      error: (ctx: IRouterContext, msg: string, meta?: object) =>
        log(ctx, 'error')(msg, meta)
    };
  };

export { ContextualLogger, getContextualLogger };
