import {DefaultCrudRepository} from '@loopback/repository';
import {DamageComment, DamageCommentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DamageCommentRepository extends DefaultCrudRepository<
  DamageComment,
  typeof DamageComment.prototype.id,
  DamageCommentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DamageComment, dataSource);
  }
}
