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
import {LiftFieldCategory} from '../models';
import {LiftFieldCategoryRepository} from '../repositories';

export class LiftFieldCategoriesController {
  constructor(
    @repository(LiftFieldCategoryRepository)
    public liftFieldCategoryRepository : LiftFieldCategoryRepository,
  ) {}

  @post('/lift-field-categories', {
    responses: {
      '200': {
        description: 'LiftFieldCategory model instance',
        content: {'application/json': {schema: {'x-ts-type': LiftFieldCategory}}},
      },
    },
  })
  async create(@requestBody() liftFieldCategory: LiftFieldCategory): Promise<LiftFieldCategory> {
    return await this.liftFieldCategoryRepository.create(liftFieldCategory);
  }

  @get('/lift-field-categories/count', {
    responses: {
      '200': {
        description: 'LiftFieldCategory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(LiftFieldCategory)) where?: Where<LiftFieldCategory>,
  ): Promise<Count> {
    return await this.liftFieldCategoryRepository.count(where);
  }

  @get('/lift-field-categories', {
    responses: {
      '200': {
        description: 'Array of LiftFieldCategory model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': LiftFieldCategory}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(LiftFieldCategory)) filter?: Filter<LiftFieldCategory>,
  ): Promise<LiftFieldCategory[]> {
    return await this.liftFieldCategoryRepository.find(filter);
  }

  @patch('/lift-field-categories', {
    responses: {
      '200': {
        description: 'LiftFieldCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LiftFieldCategory, {partial: true}),
        },
      },
    })
    liftFieldCategory: LiftFieldCategory,
    @param.query.object('where', getWhereSchemaFor(LiftFieldCategory)) where?: Where<LiftFieldCategory>,
  ): Promise<Count> {
    return await this.liftFieldCategoryRepository.updateAll(liftFieldCategory, where);
  }

  @get('/lift-field-categories/{id}', {
    responses: {
      '200': {
        description: 'LiftFieldCategory model instance',
        content: {'application/json': {schema: {'x-ts-type': LiftFieldCategory}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<LiftFieldCategory> {
    return await this.liftFieldCategoryRepository.findById(id);
  }

  @patch('/lift-field-categories/{id}', {
    responses: {
      '204': {
        description: 'LiftFieldCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LiftFieldCategory, {partial: true}),
        },
      },
    })
    liftFieldCategory: LiftFieldCategory,
  ): Promise<void> {
    await this.liftFieldCategoryRepository.updateById(id, liftFieldCategory);
  }

  @put('/lift-field-categories/{id}', {
    responses: {
      '204': {
        description: 'LiftFieldCategory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() liftFieldCategory: LiftFieldCategory,
  ): Promise<void> {
    await this.liftFieldCategoryRepository.replaceById(id, liftFieldCategory);
  }

  @del('/lift-field-categories/{id}', {
    responses: {
      '204': {
        description: 'LiftFieldCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.liftFieldCategoryRepository.deleteById(id);
  }
}
