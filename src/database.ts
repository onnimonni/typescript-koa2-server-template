/**
 * Initialized database (Bookshelf) instance
 */
import * as Bookshelf from 'bookshelf';
import * as Knex from 'knex';

import conf from './config';

const knex: Knex =  Knex(conf.get('database'));

export default Bookshelf(knex).plugin('registry');
