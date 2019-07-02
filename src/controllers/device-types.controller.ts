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
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {DeviceType} from '../models';
import {DeviceTypeRepository} from '../repositories';

export class DeviceTypesController {
  constructor(
    @repository(DeviceTypeRepository)
    public deviceTypeRepository : DeviceTypeRepository,
  ) {}

  @post('/device-types', {
    responses: {
      '200': {
        description: 'DeviceType model instance',
        content: {'application/json': {schema: {'x-ts-type': DeviceType}}},
      },
    },
  })
  async create(@requestBody() deviceType: DeviceType): Promise<DeviceType> {
    return await this.deviceTypeRepository.create(deviceType);
  }

  @get('/device-types/count', {
    responses: {
      '200': {
        description: 'DeviceType model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(DeviceType)) where?: Where<DeviceType>,
  ): Promise<Count> {
    return await this.deviceTypeRepository.count(where);
  }

  @get('/device-types', {
    responses: {
      '200': {
        description: 'Array of DeviceType model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': DeviceType}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(DeviceType)) filter?: Filter<DeviceType>,
  ): Promise<DeviceType[]> {
    return await this.deviceTypeRepository.find(filter);
  }

  @patch('/device-types', {
    responses: {
      '200': {
        description: 'DeviceType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() deviceType: DeviceType,
    @param.query.object('where', getWhereSchemaFor(DeviceType)) where?: Where<DeviceType>,
  ): Promise<Count> {
    return await this.deviceTypeRepository.updateAll(deviceType, where);
  }

  @get('/device-types/{id}', {
    responses: {
      '200': {
        description: 'DeviceType model instance',
        content: {'application/json': {schema: {'x-ts-type': DeviceType}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<DeviceType> {
    return await this.deviceTypeRepository.findById(id);
  }

  @patch('/device-types/{id}', {
    responses: {
      '204': {
        description: 'DeviceType PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() deviceType: DeviceType,
  ): Promise<void> {
    await this.deviceTypeRepository.updateById(id, deviceType);
  }

  @put('/device-types/{id}', {
    responses: {
      '204': {
        description: 'DeviceType PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() deviceType: DeviceType,
  ): Promise<void> {
    await this.deviceTypeRepository.replaceById(id, deviceType);
  }

  @del('/device-types/{id}', {
    responses: {
      '204': {
        description: 'DeviceType DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.deviceTypeRepository.deleteById(id);
  }
}
