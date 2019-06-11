import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceComment, ServiceCommentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceCommentRepository extends DefaultCrudRepository<
  ServiceComment,
  typeof ServiceComment.prototype.id,
  ServiceCommentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ServiceComment, dataSource);
  }
}
