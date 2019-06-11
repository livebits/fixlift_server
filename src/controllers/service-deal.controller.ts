import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Service,
  Deal,
} from '../models';
import {ServiceRepository} from '../repositories';

export class ServiceDealController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) { }

  @get('/services/{id}/deal', {
    responses: {
      '200': {
        description: 'Deal belonging to Service',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async getDeal(
    @param.path.number('id') id: typeof Service.prototype.id,
  ): Promise<Deal> {
    return await this.serviceRepository.deal(id);
  }
}
