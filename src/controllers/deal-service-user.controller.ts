import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Deal,
  ServiceUser,
} from '../models';
import {DealRepository} from '../repositories';

export class DealServiceUserController {
  constructor(
    @repository(DealRepository)
    public dealRepository: DealRepository,
  ) { }

  @get('/deals/{id}/service-user', {
    responses: {
      '200': {
        description: 'ServiceUser belonging to Deal',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceUser } },
          },
        },
      },
    },
  })
  async getServiceUser(
    @param.path.number('id') id: typeof Deal.prototype.id,
  ): Promise<ServiceUser> {
    return await this.dealRepository.serviceUser(id);
  }
}
