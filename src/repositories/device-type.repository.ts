import {DefaultCrudRepository} from '@loopback/repository';
import {DeviceType, DeviceTypeRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DeviceTypeRepository extends DefaultCrudRepository<
  DeviceType,
  typeof DeviceType.prototype.id,
  DeviceTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DeviceType, dataSource);
  }
}
