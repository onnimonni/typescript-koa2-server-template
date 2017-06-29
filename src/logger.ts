/**
 * Logger for backend
 */
import * as moment from 'moment';
import * as R from 'ramda';
import * as logger from 'winston';

import { ContextualLogger, getContextualLogger } from './contextualLogger';

import conf from './config';

const loggerConf: logger.ConsoleTransportOptions =
  R.assoc('timestamp', () => moment.utc().format(), conf.get('logger'));

logger.configure({
  transports: [ new (logger.transports.Console)(loggerConf) ]
});

/**
 * Contextual logger that needs to be passed ctx, msg, and possible meta
 */
const ctxLogger: ContextualLogger = getContextualLogger(conf.get('reqIdHeader'), logger);

export default ctxLogger;

export { ctxLogger, logger };
