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
  Deal,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyDealController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Array of Deal\'s belonging to Company',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Deal>,
  ): Promise<Deal[]> {
    return await this.companyRepository.deals(id).find(filter);
  }

  @post('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Deal } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Company.prototype.id,
    @requestBody() deal: Deal,
  ): Promise<Deal> {
    return await this.companyRepository.deals(id).create(deal);
  }

  @patch('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Company.Deal PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() deal: Partial<Deal>,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return await this.companyRepository.deals(id).patch(deal, where);
  }

  @del('/companies/{id}/deals', {
    responses: {
      '200': {
        description: 'Company.Deal DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return await this.companyRepository.deals(id).delete(where);
  }
}
