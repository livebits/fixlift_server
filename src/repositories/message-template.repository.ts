import {DefaultCrudRepository} from '@loopback/repository';
import {MessageTemplate, MessageTemplateRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MessageTemplateRepository extends DefaultCrudRepository<
  MessageTemplate,
  typeof MessageTemplate.prototype.id,
  MessageTemplateRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(MessageTemplate, dataSource);
  }
}
