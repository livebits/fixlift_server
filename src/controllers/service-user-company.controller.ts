import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  ServiceUser,
  Company,
} from '../models';
import {ServiceUserRepository} from '../repositories';

export class ServiceUserCompanyController {
  constructor(
    @repository(ServiceUserRepository)
    public serviceUserRepository: ServiceUserRepository,
  ) { }

  @get('/service-users/{id}/company', {
    responses: {
      '200': {
        description: 'Company belonging to ServiceUser',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async getCompany(
    @param.path.number('id') id: typeof ServiceUser.prototype.id,
  ): Promise<Company> {
    return await this.serviceUserRepository.company(id);
  }
}
