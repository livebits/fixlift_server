import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Damage,
  Deal,
} from '../models';
import {DamageRepository} from '../repositories';

export class DamageDealController {
  constructor(
    @repository(DamageRepository)
    public damageRepository: DamageRepository,
  ) { }

  @get('/damages/{id}/deal', {
    responses: {
      '200': {
        description: 'Deal belonging to Damage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async getDeal(
    @param.path.number('id') id: typeof Damage.prototype.id,
  ): Promise<Deal> {
    return await this.damageRepository.deal(id);
  }
}
