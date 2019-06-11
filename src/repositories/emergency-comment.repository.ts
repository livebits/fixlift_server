import {DefaultCrudRepository} from '@loopback/repository';
import {EmergencyComment, EmergencyCommentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EmergencyCommentRepository extends DefaultCrudRepository<
  EmergencyComment,
  typeof EmergencyComment.prototype.id,
  EmergencyCommentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(EmergencyComment, dataSource);
  }
}
