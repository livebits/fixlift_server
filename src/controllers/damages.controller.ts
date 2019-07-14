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
import { Damage, DamageFilter, Checklist } from '../models';
import { DamageRepository, DealRepository, DamageChecklistRepository, ChecklistRepository, DamageSegmentRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class DamagesController {
  constructor(
    @repository(DamageRepository)
    public damageRepository: DamageRepository,
    @repository(DamageChecklistRepository)
    public damageChecklistRepository: DamageChecklistRepository,
    @repository(DamageSegmentRepository)
    public damageSegmentRepository: DamageSegmentRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
  ) { }

  @authenticate('jwt')
  @post('/damages', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async create(
    @requestBody() damage: Damage,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Damage> {

    damage.createdBy = "operator";
    damage.creatorId = Number(currentUser.id);
    return await this.damageRepository.create(damage);
  }

  @get('/damages/count', {
    responses: {
      '200': {
        description: 'Damage model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Damage)) where?: Where<Damage>,
  ): Promise<Count> {
    return await this.damageRepository.count(where);
  }

  @get('/damages', {
    responses: {
      '200': {
        description: 'Array of Damage model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Damage } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Damage)) filter?: Filter<Damage>,
  ): Promise<Damage[]> {
    return await this.damageRepository.find(filter);
  }

  @patch('/damages', {
    responses: {
      '200': {
        description: 'Damage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Damage, { partial: true }),
        },
      },
    })
    damage: Damage,
    @param.query.object('where', getWhereSchemaFor(Damage)) where?: Where<Damage>,
  ): Promise<Count> {
    return await this.damageRepository.updateAll(damage, where);
  }

  @get('/damages/{id}', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Damage> {
    return await this.damageRepository.findById(id);
  }

  @patch('/damages/{id}', {
    responses: {
      '204': {
        description: 'Damage PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Damage, { partial: true }),
        },
      },
    })
    damage: Damage,
  ): Promise<void> {
    await this.damageRepository.updateById(id, damage);
  }

  @put('/damages/{id}', {
    responses: {
      '204': {
        description: 'Damage PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() damage: Damage,
  ): Promise<void> {
    await this.damageRepository.replaceById(id, damage);
  }

  @del('/damages/{id}', {
    responses: {
      '204': {
        description: 'Damage DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.damageRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/damages/filter', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async filter(@requestBody() damageFilter: Partial<Damage>): Promise<any> {

    let where = '';
    if (damageFilter.status && damageFilter.status !== "") {
      // where += `WHERE dmg.status = '${damageFilter.status}'`;
    }

    if (where !== '') {
      if (damageFilter.dealId && damageFilter.dealId !== 0) {
        where += ` AND d.id = '${damageFilter.dealId}'`;
      }
    } else {
      if (damageFilter.dealId && damageFilter.dealId !== 0) {
        where += `WHERE d.id = '${damageFilter.dealId}'`;
      }
    }

    const sql = `SELECT dmg.*, dmg.id AS damage_id, dmg.description AS damage_description,
      d.*, d.id AS deal_id, d.service_user_id as deal_service_user_id, l.*,
      l.id AS lift_id, r.name AS region_name
      FROM damages dmg
      LEFT JOIN deals d ON d.id = dmg.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      LEFT JOIN regions r ON d.building_region = r.id
      ${where}
      order by dmg.id desc`;

    return await this.damageRepository.query(sql);
  }

  @authenticate('jwt')
  @get('/damages/getDetail/{id}', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async getDetail(
    @param.path.number('id') id: number
  ): Promise<Damage> {

    let damage = await this.damageRepository.findById(id);
    damage.deal = await this.damageRepository.deal(id);
    damage.deal.lift = await this.dealRepository.lift(damage.deal.id).get();

    if (damage.status == "done") {
      let damageChecklists = await this.damageRepository.damageChecklists(damage.id).find();

      //add checklist
      await Promise.all(
        damageChecklists.map(async dcl => {
          try {
            const sql = `SELECT c.id, c.title, c.priority, c.status, clc.title AS checkListCategoryTitle, clc.priority AS checkListCategoryPriority
              FROM checklists c
              LEFT JOIN checklist_categories clc ON c.checklist_category_id = checklist_categories.id
              WHERE c.id = ${dcl.checklistId}
              ORDER BY clc.priority ASC, c.priority ASC`;

            let checklist = await this.checklistRepository.query(sql);
            dcl.checklist = checklist[0];
          } catch {

          }
        }),
      );

      damage.damageChecklists = damageChecklists;

      //damage segment items
      let damageSegments = await this.damageRepository.damageSegments(damage.id).find();
      await Promise.all(
        damageSegments.map(async ds => {
          try {
            ds.segment = await this.damageSegmentRepository.segment(ds.id);
          } catch {

          }
        }),
      );
      damage.damageSegments = damageSegments;

      //damage factor items
      let damageFactors = await this.damageRepository.damageFactors(damage.id).find();
      damage.damageFactors = damageFactors;

    }

    return damage;
  }
}
