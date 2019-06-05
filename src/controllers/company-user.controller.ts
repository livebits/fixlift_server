import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Company,
  User,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyUserController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Company',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': User } },
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Company.prototype.id,
  ): Promise<User> {
    return await this.companyRepository.user(id);
  }
}
