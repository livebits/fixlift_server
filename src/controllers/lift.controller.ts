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
import { Lift } from '../models';
import { LiftRepository } from '../repositories';

export class LiftController {
  constructor(
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
  ) { }

  @post('/lifts', {
    responses: {
      '200': {
        description: 'Lift model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Lift } } },
      },
    },
  })
  async create(@requestBody() lift: Lift): Promise<Lift> {
    return await this.liftRepository.create(lift);
  }

  @get('/lifts/count', {
    responses: {
      '200': {
        description: 'Lift model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Lift)) where?: Where<Lift>,
  ): Promise<Count> {
    return await this.liftRepository.count(where);
  }

  @get('/lifts', {
    responses: {
      '200': {
        description: 'Array of Lift model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Lift } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Lift)) filter?: Filter<Lift>,
  ): Promise<Lift[]> {
    return await this.liftRepository.find(filter);
  }

  @patch('/lifts', {
    responses: {
      '200': {
        description: 'Lift PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lift, { partial: true }),
        },
      },
    })
    lift: Lift,
    @param.query.object('where', getWhereSchemaFor(Lift)) where?: Where<Lift>,
  ): Promise<Count> {
    return await this.liftRepository.updateAll(lift, where);
  }

  @get('/lifts/{id}', {
    responses: {
      '200': {
        description: 'Lift model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Lift } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Lift> {
    return await this.liftRepository.findById(id);
  }

  @patch('/lifts/{id}', {
    responses: {
      '204': {
        description: 'Lift PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lift, { partial: true }),
        },
      },
    })
    lift: Lift,
  ): Promise<void> {
    await this.liftRepository.updateById(id, lift);
  }

  @put('/lifts/{id}', {
    responses: {
      '204': {
        description: 'Lift PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lift: Lift,
  ): Promise<void> {
    await this.liftRepository.replaceById(id, lift);
  }

  @del('/lifts/{id}', {
    responses: {
      '204': {
        description: 'Lift DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.liftRepository.deleteById(id);
  }

  @get('/lifts/device-fields/{device_type_id}', {
    responses: {
      '200': {
        description: 'Lift model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Lift } } },
      },
    },
  })
  async deviceFields(@param.path.number('device_type_id') deviceTypeId: number): Promise<any> {

    const sql = `SELECT lf.id, lf.title, lf.field_type, lf.priority, lfc.title as categoryTitle, lfc.priority as categoryPriority
      FROM lift_fields lf
      LEFT JOIN lift_field_categories lfc ON lfc.id = lf.lift_field_category_id
      WHERE lfc.device_type_id = ${deviceTypeId}
      ORDER BY lfc.priority ASC, lf.priority ASC`;

    return await this.liftRepository.query(sql);

    // return await this.liftRepository.findById(id);
  }

  @get('/lifts/get-device-fields/{lift_id}', {
    responses: {
      '200': {
        description: 'Lift model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Lift } } },
      },
    },
  })
  async getDeviceFields(@param.path.number('lift_id') liftId: number): Promise<any> {

    const sql = `SELECT lf.id, lf.title, lf.field_type, lf.priority, lfc.title as categoryTitle,
      lfc.priority as categoryPriority, lfvv.id as lift_field_value_id,
      CASE WHEN lfvv.lift_id = l.id THEN lfvv.value ELSE '' END AS value
      FROM lift_fields lf
      LEFT JOIN lift_field_categories lfc ON lfc.id = lf.lift_field_category_id
      LEFT JOIN (
        SELECT lfv.id, lfv.lift_field_id, lfv.value, lfv.lift_id
        FROM lift_field_values lfv
        WHERE lfv.lift_id = ${liftId}
      ) AS lfvv ON lfvv.lift_field_id = lf.id
      LEFT JOIN lifts l ON l.id = ${liftId}
      WHERE lfc.device_type_id = l.device_type_id
      ORDER BY lfc.priority ASC, lf.priority ASC`;

    return await this.liftRepository.query(sql);

    // return await this.liftRepository.findById(id);
  }
}
