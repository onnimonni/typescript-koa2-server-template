import * as Convict from 'convict';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaRouter from 'koa-router';

import koaLogger from './middleware/koaLogger';
import requestId from './middleware/requestId';

import conf from './config';
import { ctxLogger, logger } from './logger';
import ApiRouter from './router';

const reqIdHeader: string = conf.get('reqIdHeader');

export default class RandomApi extends Koa {
  /**
   * @constructor
   * @param config Configuration
   */
  constructor(readonly config: Convict.Config) {
    super();
    const apiRouter: KoaRouter = new ApiRouter();

    this.use(requestId(reqIdHeader));
    this.use(koaLogger(ctxLogger));
    this.use(bodyParser());

    this.use(apiRouter.routes());
  }

  /**
   * Starts the application and binds to configured address and port
   */
  public start = (): void => {
    const ip: string = this.config.get('ip');
    const port: number = this.config.get('port');

    this.listen(port, ip, () => logger.info(`Listening on ${ip}:${port}`));
  }
}

if (!module.parent) {
  const app: RandomApi = new RandomApi(conf);
  app.start();
}
