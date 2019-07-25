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
import { Damage, DamageFilter, Checklist, DamageChecklist, DamageSegment, DamageFactor } from '../models';
import { DamageRepository, DealRepository, DamageChecklistRepository, ChecklistRepository, DamageSegmentRepository, LiftRepository, DamageFactorRepository, SegmentRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';
var moment = require('moment');
var jMoment = require('moment-jalaali');

export class DamagesController {
  constructor(
    @repository(DamageRepository)
    public damageRepository: DamageRepository,
    @repository(DamageFactorRepository)
    public damageFactorRepository: DamageFactorRepository,
    @repository(DamageChecklistRepository)
    public damageChecklistRepository: DamageChecklistRepository,
    @repository(DamageSegmentRepository)
    public damageSegmentRepository: DamageSegmentRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
    @repository(SegmentRepository)
    public segmentRepository: SegmentRepository,
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

  @authenticate('jwt')
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
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Damage)) filter?: Filter<Damage>,
  ): Promise<{ data: Damage[], total: number }> {

    let now = new Date();

    let dealsIds: (number[]) = [];
    let deals = await this.dealRepository.find({ where: { companyUserId: Number(currentUser.id) }, fields: { id: true } });
    deals.forEach(deal => {
      dealsIds.push(deal.id ? deal.id : 0);
    });

    let cloneFilter = Object.assign({}, filter);
    if (filter !== undefined) {
      if (filter.where !== undefined) {

        let myFilter = {};

        let damageFilter: { search: string, damageType: string, damageTime: string } = <{ search: string, damageType: string, damageTime: string }>filter.where;
        if (damageFilter.search != null) {
          myFilter = { ...myFilter, ...{ or: [{ damageText: { like: damageFilter.search } }, { description: { like: damageFilter.search } }, { serviceUserReport: { like: damageFilter.search } }] } }
        }

        if (damageFilter.damageType != null) {

          switch (damageFilter.damageType) {
            case 'all':
            case '':
              myFilter = { ...myFilter }
              break;
            case 'undone':
              myFilter = { ...myFilter, ...{ or: [{ status: { eq: 'undone' } }, { status: { eq: 'submitted' } }, { status: { eq: '' } }, { status: { eq: null } }] } }
              break
            case 'done':
              myFilter = { ...myFilter, ...{ status: { eq: 'done' } } }
              break;
            default:
              break;
          }
        }

        if (damageFilter.damageTime != null) {

          switch (damageFilter.damageTime) {
            case 'all':
            case '':
              myFilter = { ...myFilter }
              break;
            case 'thisWeek':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().endOf('isoWeek') } }, { time: { gte: moment().startOf('isoWeek') } }] } }
              break;
            case 'lastWeek':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().subtract(1, 'weeks').endOf('isoWeek') } }, { time: { gte: moment().subtract(1, 'weeks').startOf('isoWeek') } }] } }
              break;
            case 'thisMonth':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().endOf('month') } }, { time: { gte: moment().startOf('month') } }] } }
              break;
            case 'lastMonth':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().subtract(1, 'months').endOf('month') } }, { time: { gte: moment().subtract(1, 'months').startOf('month') } }] } }
              break;
            case 'thisYear':
              myFilter = { ...myFilter, ...{ and: [{ time: { gte: moment().startOf('year') } }, { time: { lte: moment().endOf('year') } }] } }
              break;
            case 'lastYears':
              myFilter = { ...myFilter, ...{ time: { lte: moment().startOf('year') } } }
              break;

            default:
              break;
          }
        }

        filter.where = { ...filter.where, ...myFilter }

        filter.where = { and: [{ dealId: { inq: dealsIds } }, filter.where] };
      } else {
        filter.where = { and: [{ dealId: { inq: dealsIds } }, { time: { lte: now.toISOString() } }] };
      }
    } else {
      filter = { where: { and: [{ dealId: { inq: dealsIds } }, { time: { lte: now.toISOString() } }] } };
    }

    // const sql = `SELECT d.id, d.service_user_id as serviceUserId, d.time, d.done_date as doneDate, d.start_time AS startTime,
    // d.finish_time as finishTime, d.service_user_report as serviceUserReport, d.customer_reminder AS customerReminder,
    // d.service_user_reminder AS serviceUserReminder, deals.id as dealId
    // FROM damages d
    // LEFT JOIN deals ON deals.id = d.deal_id
    // WHERE deals.company_user_id = ${currentUser.id}
    // order by d.id desc`;

    // return await this.damageRepository.query(sql);

    let damages = await this.damageRepository.find(filter);
    let total = await this.damageRepository.count(filter.where);

    return { data: damages, total: total.count }
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

  @authenticate('jwt')
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
          schema: getModelSchemaRef(Damage),
        },
      },
    })
    damage: Damage,
  ): Promise<Damage> {

    delete damage.creatorId;
    delete damage.damageText;
    delete damage.dealId;
    delete damage.serviceUserId;

    if (damage.serviceUserReport !== null) {
      damage.status = "done";
    }

    //update damage
    await this.damageRepository.updateById(id, damage);

    //delete prev damage checklists, segments and factors
    await this.damageChecklistRepository.deleteAll({ damageId: damage.id });
    await this.damageSegmentRepository.deleteAll({ damageId: damage.id });
    await this.damageFactorRepository.deleteAll({ damageId: damage.id });

    //add damage checklists
    let damageChecklists: DamageChecklist[] = [];
    damage.checklists && damage.checklists.forEach(checklist => {
      let damageChecklist = new DamageChecklist();
      damageChecklist.checklistId = checklist.id;
      damageChecklist.damageId = damage.id;
      damageChecklist.status = checklist.status;

      damageChecklists.push(damageChecklist)
    });
    if (damageChecklists.length > 0) {
      await this.damageChecklistRepository.createAll(damageChecklists);
    }

    //add damage segments
    let damageSegments: DamageSegment[] = [];
    let factorCost: number = 0;
    damage.segments && damage.segments.forEach(segment => {
      let damageSegment = new DamageSegment();
      damageSegment.segmentId = segment.id;
      damageSegment.damageId = damage.id;
      damageSegment.status = segment.status;
      damageSegment.count = segment.count;
      damageSegment.singleCost = segment.price;
      let cost: number = (segment.price != undefined && segment.count != undefined) ? (segment.price * segment.count) : 0;
      damageSegment.cost = cost;
      factorCost += cost;

      damageSegments.push(damageSegment)
    });
    if (damageSegments.length > 0) {
      await this.damageSegmentRepository.createAll(damageSegments);
    }

    //add damage factor
    if (damageSegments.length > 0) {

      let damageFactor = new DamageFactor()
      damageFactor.damageId = damage.id;
      damageFactor.cost = factorCost;
      damageFactor.status = (damage.damageFactors !== null && damage.damageFactors.length > 0) ? damage.damageFactors[0].status : "submitted";;
      await this.damageFactorRepository.create(damageFactor);
    }


    return damage;
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
  async filter(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody() damageFilter: DamageFilter
  ): Promise<any> {

    let where = '';
    if (damageFilter.appType == "customer") {
      where += `WHERE d.customer_id = ${currentUser.id}`;
    } else {
      where += `WHERE dmg.service_user_id = ${currentUser.id}`;
    }

    if (damageFilter.status && damageFilter.status !== "") {
      if (damageFilter.status == "done") {
        where += ` AND dmg.status = 'done'`;
      } else {
        where += ` AND (dmg.status LIKE 'undone' OR dmg.status LIKE 'submitted' OR dmg.status IS NULL)`;
      }
    }

    if (where !== '') {
      if (damageFilter.dealId && damageFilter.dealId !== 0) {
        where += ` AND dmg.deal_id = '${damageFilter.dealId}'`;
      }
    }

    if (where !== '') {
      if (damageFilter.date && damageFilter.date !== "") {
        let startDate = jMoment(damageFilter.date + ' 00:00', 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')
        let endDate = jMoment(damageFilter.date + ' 23:59', 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')
        where += ` AND dmg.time BETWEEN '${startDate}' AND '${endDate}' `;
      }
    }

    const sql = `SELECT dmg.id as id, dmg.created_on as createdOn, dmg.service_user_id AS serviceUserId,
      dmg.time, dmg.start_time as startTime, dmg.finish_time as finishTime, dmg.service_user_report as serviceUserReport,
      dmg.description, dmg.service_user_reminder as serviceUserReminder,
      dmg.status, dmg.damage_text as damageText, dmg.customer_reminder as customerReminder, dt.title as deviceType
      FROM damages dmg
      LEFT JOIN deals d ON d.id = dmg.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      LEFT JOIN device_types dt ON dt.id = l.device_type_id
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

    try {
      damage.deal.lift = await this.dealRepository.lift(damage.deal.id).get();
      damage.deal.lift.deviceType = await this.liftRepository.deviceType(damage.deal.lift.id);
    } catch (error) {

    }

    // if (damage.status == "done") {
    // let damageChecklists = await this.damageRepository.damageChecklists(damage.id).find();

    //add checklist
    // await Promise.all(
    //   damageChecklists.map(async dcl => {
    //     try {
    //       const sql = `SELECT c.id, c.title, c.priority, c.status, clc.title AS checkListCategoryTitle, clc.priority AS checkListCategoryPriority
    //         FROM checklists c
    //         LEFT JOIN checklist_categories clc ON c.checklist_category_id = clc.id
    //         WHERE c.id = ${dcl.checklistId}
    //         ORDER BY clc.priority ASC, c.priority ASC`;

    //       let checklist = await this.checklistRepository.query(sql);
    //       dcl.checklist = checklist[0];
    //     } catch (ex) {

    //     }
    //   }),
    // );

    try {
      const sql = `SELECT c.id, c.title, c.priority, clc.title AS checkListCategoryTitle,
          clc.priority AS checkListCategoryPriority, dc.status, CASE WHEN dc.status IS NULL THEN false ELSE true END AS isChecked, dc.description
          FROM checklists c
          LEFT JOIN checklist_categories clc ON c.checklist_category_id = clc.id
          LEFT JOIN damage_checklists dc ON (dc.checklist_id = c.id AND dc.damage_id = ${damage.id})
          WHERE clc.company_user_id = ${damage.deal.companyUserId}
          GROUP BY c.id
          ORDER BY clc.priority ASC, c.priority ASC, clc.id ASC`;

      let checklist = await this.checklistRepository.query(sql);
      damage.checklists = checklist;
    } catch (ex) {

    }

    //damage segment items
    // let damageSegments = await this.damageRepository.damageSegments(damage.id).find();
    // await Promise.all(
    //   damageSegments.map(async ds => {
    //     try {
    //       ds.segment = await this.damageSegmentRepository.segment(ds.id);
    //     } catch {

    //     }
    //   }),
    // );
    // damage.damageSegments = damageSegments;
    try {
      const sql = `SELECT s.id, s.name, s.country, s.brand,
          s.price, ds.count, ds.status, ds.single_cost as singleCost,
          ds.cost, ds.id as damageSegmentId
          FROM segments s
          LEFT JOIN damage_segments ds ON ds.segment_id = s.id
          WHERE s.company_user_id = ${damage.deal.companyUserId}
          AND ds.damage_id = ${damage.id}
          ORDER BY s.id ASC`;

      let segments = await this.segmentRepository.query(sql);
      damage.segments = segments;
    } catch (ex) {
      // console.log(ex);

    }

    //damage factor items
    let damageFactors = await this.damageRepository.damageFactors(damage.id).find();
    damage.damageFactors = damageFactors;

    // }

    try {
      damage.serviceUser = await this.damageRepository.serviceUser(id);
    } catch (error) {

    }
    return damage;
  }

  @post('/damages/{id}/damage-segments', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DamageSegment } } },
      },
    },
  })
  async addSegment(
    @param.path.number('id') id: typeof Damage.prototype.id,
    @requestBody() damageSegment: DamageSegment,
  ): Promise<DamageSegment> {

    let damageSegments = await this.damageSegmentRepository.find(
      {
        where: {
          damageId: id,
          segmentId: damageSegment.segmentId,
        }
      }
    );

    if (damageSegments.length > 0) {

      let count: (number | undefined) = (damageSegment.count != undefined && damageSegments[0].count !== undefined) ? (damageSegment.count + damageSegments[0].count) : 0;
      let cost: (number | undefined) = (damageSegments[0].singleCost !== undefined) ? (damageSegments[0].singleCost * count) : 0;
      await this.damageSegmentRepository.updateById(damageSegments[0].id, { count: count, cost: cost })

    } else {
      let segment = await this.segmentRepository.findById(damageSegment.segmentId);
      damageSegment.singleCost = segment.price;
      damageSegment.status = "1";
      damageSegment.cost = (segment.price != undefined && damageSegment.count !== undefined) ? segment.price * damageSegment.count : 0;
      await this.damageRepository.damageSegments(id).create(damageSegment);
    }

    let thisDamageSegments = await this.damageSegmentRepository.find({ where: { damageId: id } });
    let factorCost = 0;
    thisDamageSegments.forEach(ds => {
      factorCost += ds.cost !== undefined ? ds.cost : 0;
    });

    //delete prev damage factor
    await this.damageFactorRepository.deleteAll({ damageId: id });

    //update damage factor
    let damageFactor = new DamageFactor()
    damageFactor.damageId = id;
    damageFactor.cost = factorCost;
    damageFactor.status = "submitted";

    await this.damageFactorRepository.create(damageFactor);

    return damageSegment;
  }

  @del('/damages/delete-damage-segments/{id}', {
    responses: {
      '200': {
        description: 'Damage.DamageSegment DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async deleteDamageSegment(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DamageSegment)) where?: Where<DamageSegment>,
  ): Promise<Count> {

    let damageSegment = await this.damageSegmentRepository.findById(id);

    let deletedCount = await this.damageSegmentRepository.deleteAll({ id: id });

    let thisDamageSegments = await this.damageSegmentRepository.find({ where: { damageId: damageSegment.damageId } });
    let factorCost = 0;
    thisDamageSegments.forEach(ds => {
      factorCost += ds.cost !== undefined ? ds.cost : 0;
    });

    //delete prev damage factor
    await this.damageFactorRepository.deleteAll({ damageId: damageSegment.damageId });

    //update damage factor
    let damageFactor = new DamageFactor()
    damageFactor.damageId = damageSegment.damageId;
    damageFactor.cost = factorCost;
    damageFactor.status = "submitted";

    await this.damageFactorRepository.create(damageFactor);

    return deletedCount;
  }
}
