import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { DealPlaceholder, TableFieldsQuery } from '../models';
import { DealPlaceholderRepository } from '../repositories';

export class DealPlaceholderController {
  constructor(
    @repository(DealPlaceholderRepository)
    public dealPlaceholderRepository: DealPlaceholderRepository,
  ) { }

  @post('/deal-placeholders', {
    responses: {
      '200': {
        description: 'DealPlaceholder model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DealPlaceholder } } },
      },
    },
  })
  async create(@requestBody() dealPlaceholder: DealPlaceholder): Promise<DealPlaceholder> {
    return await this.dealPlaceholderRepository.create(dealPlaceholder);
  }

  @get('/deal-placeholders/count', {
    responses: {
      '200': {
        description: 'DealPlaceholder model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(DealPlaceholder)) where?: Where<DealPlaceholder>,
  ): Promise<Count> {
    return await this.dealPlaceholderRepository.count(where);
  }

  @get('/deal-placeholders', {
    responses: {
      '200': {
        description: 'Array of DealPlaceholder model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': DealPlaceholder } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(DealPlaceholder)) filter?: Filter<DealPlaceholder>,
  ): Promise<DealPlaceholder[]> {
    return await this.dealPlaceholderRepository.find(filter);
  }

  @patch('/deal-placeholders', {
    responses: {
      '200': {
        description: 'DealPlaceholder PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DealPlaceholder, { partial: true }),
        },
      },
    })
    dealPlaceholder: DealPlaceholder,
    @param.query.object('where', getWhereSchemaFor(DealPlaceholder)) where?: Where<DealPlaceholder>,
  ): Promise<Count> {
    return await this.dealPlaceholderRepository.updateAll(dealPlaceholder, where);
  }

  @get('/deal-placeholders/{id}', {
    responses: {
      '200': {
        description: 'DealPlaceholder model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DealPlaceholder } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<DealPlaceholder> {
    return await this.dealPlaceholderRepository.findById(id);
  }

  @patch('/deal-placeholders/{id}', {
    responses: {
      '204': {
        description: 'DealPlaceholder PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DealPlaceholder, { partial: true }),
        },
      },
    })
    dealPlaceholder: DealPlaceholder,
  ): Promise<void> {
    await this.dealPlaceholderRepository.updateById(id, dealPlaceholder);
  }

  @put('/deal-placeholders/{id}', {
    responses: {
      '204': {
        description: 'DealPlaceholder PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() dealPlaceholder: DealPlaceholder,
  ): Promise<void> {
    await this.dealPlaceholderRepository.replaceById(id, dealPlaceholder);
  }

  @del('/deal-placeholders/{id}', {
    responses: {
      '204': {
        description: 'DealPlaceholder DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.dealPlaceholderRepository.deleteById(id);
  }

  @post('/deal-placeholders/get-table-fields', {
    responses: {
      '200': {
        description: 'DealPlaceholder model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DealPlaceholder } } },
      },
    },
  })
  async gettableFields(@requestBody() tableFieldsQuery: TableFieldsQuery): Promise<any> {

    const sql = `SHOW COLUMNS FROM fixlift.${tableFieldsQuery.table}`;

    return await this.dealPlaceholderRepository.query(sql);
  }
}
