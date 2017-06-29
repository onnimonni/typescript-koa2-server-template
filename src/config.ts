import * as convict from 'convict';
import { existsSync } from 'fs';
import * as path from 'path';

const conf: convict.Config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 5000,
    env: 'PORT'
  },
  reqIdHeader: {
    doc: 'The header where request ID is',
    format: String,
    default: 'api-request-id',
    env: 'REQUEST_ID_HEADER'
  },
  logger: {
    level: {
      doc: 'Logging level',
      level: [ 'debug', 'info', 'warn', 'error' ],
      default: 'debug',
      env: 'LOG_LEVEL'
    },
    colorize: {
      doc: 'Colorize the logs or not',
      format: Boolean,
      default: true
    },
    prettyPrint: {
      doc: 'Pretty print the extra data',
      format: Boolean,
      default: true,
      env: 'LOG_PRETTY'
    },
    json: {
      doc: 'Print logs as JSON',
      format: Boolean,
      default: false,
      env: 'LOG_JSON'
    }
  },
  database: {
    client: {
      doc: 'Database client library',
      format: String,
      default: 'pg',
      env: 'DB_CLIENT'
    },
    connection: {
      host: {
        doc: 'Database host address',
        format: String,
        default: 'localhost',
        env: 'DB_HOST'
      },
      port: {
        doc: 'Database port',
        format: 'port',
        default: 5432,
        env: 'DB_PORT'
      },
      database: {
        doc: 'Database name',
        format: String,
        default: 'hellodb',
        env: 'DB_NAME'
      },
      user: {
        doc: 'Database user',
        format: String,
        default: 'hellouser',
        env: 'DB_USER'
      },
      password: {
        doc: 'Database password',
        format: String,
        default: '',
        env: 'DB_PASSWORD'
      }
    },
    pool: {
      min: {
        doc: 'Minimum pool size',
        format: 'nat',
        default: 2,
        env: 'DB_POOL_MIN'
      },
      max: {
        doc: 'Maximum pool size',
        format: 'nat',
        default: 10,
        env: 'DB_POOL_MAX'
      }
    }
  }
});

const confFolder: string = __dirname.match(/build.src$/) ?
  path.join(__dirname, '..', '..', 'config')
  :
  path.join(__dirname, '..', 'config');

const confFile: string = path.join(confFolder, `${conf.get('env')}.json`);

if (existsSync(confFile)) {
  conf
    .loadFile(confFile)
    .validate({ allowed: 'strict' });
}

export default conf;
