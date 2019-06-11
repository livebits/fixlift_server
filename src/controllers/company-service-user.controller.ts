import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Company,
  ServiceUser,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyServiceUserController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/service-users', {
    responses: {
      '200': {
        description: 'Array of ServiceUser\'s belonging to Company',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceUser } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ServiceUser>,
  ): Promise<ServiceUser[]> {
    return await this.companyRepository.serviceUsers(id).find(filter);
  }

  @post('/companies/{id}/service-users', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUser } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Company.prototype.id,
    @requestBody() serviceUser: ServiceUser,
  ): Promise<ServiceUser> {
    return await this.companyRepository.serviceUsers(id).create(serviceUser);
  }

  @patch('/companies/{id}/service-users', {
    responses: {
      '200': {
        description: 'Company.ServiceUser PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() serviceUser: Partial<ServiceUser>,
    @param.query.object('where', getWhereSchemaFor(ServiceUser)) where?: Where<ServiceUser>,
  ): Promise<Count> {
    return await this.companyRepository.serviceUsers(id).patch(serviceUser, where);
  }

  @del('/companies/{id}/service-users', {
    responses: {
      '200': {
        description: 'Company.ServiceUser DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ServiceUser)) where?: Where<ServiceUser>,
  ): Promise<Count> {
    return await this.companyRepository.serviceUsers(id).delete(where);
  }
}
