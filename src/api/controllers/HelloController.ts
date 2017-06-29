import { Collection } from 'bookshelf';
import { IRouterContext } from 'koa-router';

import ctxLogger from '../../logger';
import errorHandler from '../../middleware/errorHandler';

import Hello from '../../models/Hello';

/**
 * List all greetings
 *
 * @param ctx
 */
/* tslint:disable-next-line:no-any */
const list: (ctx: IRouterContext) => Promise<any> =
  async(ctx) => {
    ctxLogger.info(ctx, 'Someone needs a greeting');

    return (new Hello())
      .fetchAll({ withRelated: ['users'] })
      .then((hellos: Collection<Hello>) => ctx.body = hellos.toJSON())
      .catch(errorHandler(ctx));
  };

export { list };
