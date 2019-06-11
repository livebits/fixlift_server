import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Deal,
  Company,
} from '../models';
import {DealRepository} from '../repositories';

export class DealCompanyController {
  constructor(
    @repository(DealRepository)
    public dealRepository: DealRepository,
  ) { }

  @get('/deals/{id}/company', {
    responses: {
      '200': {
        description: 'Company belonging to Deal',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async getCompany(
    @param.path.number('id') id: typeof Deal.prototype.id,
  ): Promise<Company> {
    return await this.dealRepository.company(id);
  }
}
