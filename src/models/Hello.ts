import Bookshelf from '../database';
import User from './User';

export default class Hello extends Bookshelf.Model<Hello> {
  get tableName(): string {
    return 'hellos';
  }

  public user = (): User => this.belongsTo(User, 'user_id');
}
