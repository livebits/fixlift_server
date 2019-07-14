import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DamageChecklist, DamageChecklistRelations, Checklist} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ChecklistRepository} from './checklist.repository';

export class DamageChecklistRepository extends DefaultCrudRepository<
  DamageChecklist,
  typeof DamageChecklist.prototype.id,
  DamageChecklistRelations
> {

  public readonly checklist: BelongsToAccessor<Checklist, typeof DamageChecklist.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ChecklistRepository') protected checklistRepositoryGetter: Getter<ChecklistRepository>,
  ) {
    super(DamageChecklist, dataSource);
    this.checklist = this.createBelongsToAccessorFor('checklist', checklistRepositoryGetter,);
  }
}
