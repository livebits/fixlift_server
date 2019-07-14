import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  DamageChecklist,
  Checklist,
} from '../models';
import {DamageChecklistRepository} from '../repositories';

export class DamageChecklistChecklistController {
  constructor(
    @repository(DamageChecklistRepository)
    public damageChecklistRepository: DamageChecklistRepository,
  ) { }

  @get('/damage-checklists/{id}/checklist', {
    responses: {
      '200': {
        description: 'Checklist belonging to DamageChecklist',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Checklist } },
          },
        },
      },
    },
  })
  async getChecklist(
    @param.path.number('id') id: typeof DamageChecklist.prototype.id,
  ): Promise<Checklist> {
    return await this.damageChecklistRepository.checklist(id);
  }
}
