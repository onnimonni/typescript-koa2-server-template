import { Collection } from 'bookshelf';

import Bookshelf from '../database';
import Hello from './Hello';

export default class User extends Bookshelf.Model<User> {
  get tableName(): string {
    return 'users';
  }

  public hellos = (): Collection<Hello> => this.hasMany(Hello, 'user_id');
}
