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
  Deal,
  Insurance,
} from '../models';
import {DealRepository} from '../repositories';

export class DealInsuranceController {
  constructor(
    @repository(DealRepository) protected dealRepository: DealRepository,
  ) { }

  @get('/deals/{id}/insurances', {
    responses: {
      '200': {
        description: 'Array of Insurance\'s belonging to Deal',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Insurance } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Insurance>,
  ): Promise<Insurance[]> {
    return await this.dealRepository.insurances(id).find(filter);
  }

  @post('/deals/{id}/insurances', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Insurance } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Deal.prototype.id,
    @requestBody() insurance: Insurance,
  ): Promise<Insurance> {
    return await this.dealRepository.insurances(id).create(insurance);
  }

  @patch('/deals/{id}/insurances', {
    responses: {
      '200': {
        description: 'Deal.Insurance PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() insurance: Partial<Insurance>,
    @param.query.object('where', getWhereSchemaFor(Insurance)) where?: Where<Insurance>,
  ): Promise<Count> {
    return await this.dealRepository.insurances(id).patch(insurance, where);
  }

  @del('/deals/{id}/insurances', {
    responses: {
      '200': {
        description: 'Deal.Insurance DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Insurance)) where?: Where<Insurance>,
  ): Promise<Count> {
    return await this.dealRepository.insurances(id).delete(where);
  }
}
