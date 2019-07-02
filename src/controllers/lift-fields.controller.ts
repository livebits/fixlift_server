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
import {LiftField} from '../models';
import {LiftFieldRepository} from '../repositories';

export class LiftFieldsController {
  constructor(
    @repository(LiftFieldRepository)
    public liftFieldRepository : LiftFieldRepository,
  ) {}

  @post('/lift-fields', {
    responses: {
      '200': {
        description: 'LiftField model instance',
        content: {'application/json': {schema: {'x-ts-type': LiftField}}},
      },
    },
  })
  async create(@requestBody() liftField: LiftField): Promise<LiftField> {
    return await this.liftFieldRepository.create(liftField);
  }

  @get('/lift-fields/count', {
    responses: {
      '200': {
        description: 'LiftField model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(LiftField)) where?: Where<LiftField>,
  ): Promise<Count> {
    return await this.liftFieldRepository.count(where);
  }

  @get('/lift-fields', {
    responses: {
      '200': {
        description: 'Array of LiftField model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': LiftField}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(LiftField)) filter?: Filter<LiftField>,
  ): Promise<LiftField[]> {
    return await this.liftFieldRepository.find(filter);
  }

  @patch('/lift-fields', {
    responses: {
      '200': {
        description: 'LiftField PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LiftField, {partial: true}),
        },
      },
    })
    liftField: LiftField,
    @param.query.object('where', getWhereSchemaFor(LiftField)) where?: Where<LiftField>,
  ): Promise<Count> {
    return await this.liftFieldRepository.updateAll(liftField, where);
  }

  @get('/lift-fields/{id}', {
    responses: {
      '200': {
        description: 'LiftField model instance',
        content: {'application/json': {schema: {'x-ts-type': LiftField}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<LiftField> {
    return await this.liftFieldRepository.findById(id);
  }

  @patch('/lift-fields/{id}', {
    responses: {
      '204': {
        description: 'LiftField PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LiftField, {partial: true}),
        },
      },
    })
    liftField: LiftField,
  ): Promise<void> {
    await this.liftFieldRepository.updateById(id, liftField);
  }

  @put('/lift-fields/{id}', {
    responses: {
      '204': {
        description: 'LiftField PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() liftField: LiftField,
  ): Promise<void> {
    await this.liftFieldRepository.replaceById(id, liftField);
  }

  @del('/lift-fields/{id}', {
    responses: {
      '204': {
        description: 'LiftField DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.liftFieldRepository.deleteById(id);
  }
}
