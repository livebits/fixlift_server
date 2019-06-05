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
  User,
  Company,
} from '../models';
import {UserRepository} from '../repositories';

export class UserCompanyController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/companies', {
    responses: {
      '200': {
        description: 'Array of Company\'s belonging to User',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Company>,
  ): Promise<Company[]> {
    return await this.userRepository.companies(id).find(filter);
  }

  @post('/users/{id}/companies', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody() company: Company,
  ): Promise<Company> {
    return await this.userRepository.companies(id).create(company);
  }

  @patch('/users/{id}/companies', {
    responses: {
      '200': {
        description: 'User.Company PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() company: Partial<Company>,
    @param.query.object('where', getWhereSchemaFor(Company)) where?: Where<Company>,
  ): Promise<Count> {
    return await this.userRepository.companies(id).patch(company, where);
  }

  @del('/users/{id}/companies', {
    responses: {
      '200': {
        description: 'User.Company DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Company)) where?: Where<Company>,
  ): Promise<Count> {
    return await this.userRepository.companies(id).delete(where);
  }
}
