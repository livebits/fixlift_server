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
import { Service, ServiceFilter, ServiceChecklist, ServiceSegment, ServiceFactor } from '../models';
import { ServiceRepository, DealRepository, ServiceChecklistRepository, ServiceSegmentRepository, ChecklistRepository, LiftRepository, ServiceFactorRepository, SegmentRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';
var moment = require('moment');
var jMoment = require('moment-jalaali');

export class ServicesController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
    @repository(ServiceFactorRepository)
    public serviceFactorRepository: ServiceFactorRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(ServiceChecklistRepository)
    public serviceChecklistRepository: ServiceChecklistRepository,
    @repository(ServiceSegmentRepository)
    public serviceSegmentRepository: ServiceSegmentRepository,
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
    @repository(SegmentRepository)
    public segmentRepository: SegmentRepository,
  ) { }

  @post('/services', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async create(@requestBody() service: Service): Promise<Service> {
    service.status = "submitted";
    return await this.serviceRepository.create(service);
  }

  @get('/services/count', {
    responses: {
      '200': {
        description: 'Service model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Service)) where?: Where<Service>,
  ): Promise<Count> {
    return await this.serviceRepository.count(where);
  }

  @authenticate('jwt')
  @get('/services', {
    responses: {
      '200': {
        description: 'Array of Service model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Service } },
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Service)) filter?: Filter<Service>,
  ): Promise<{ data: Service[], total: number }> {

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

        let serviceFilter: { search: string, serviceType: string, serviceTime: string } = <{ search: string, serviceType: string, serviceTime: string }>filter.where;
        if (serviceFilter.search != null) {
          myFilter = { ...myFilter, ...{ or: [{ damageText: { like: serviceFilter.search } }, { customerDescription: { like: serviceFilter.search } }, { serviceUserReport: { like: serviceFilter.search } }, { serviceUserReminder: { like: serviceFilter.search } }] } }
        }

        if (serviceFilter.serviceType != null) {

          switch (serviceFilter.serviceType) {
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

        if (serviceFilter.serviceTime != null) {

          switch (serviceFilter.serviceTime) {
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
        } else {
          myFilter = { ...myFilter, ...{ time: { lte: now.toISOString() } } }
        }

        filter.where = { ...filter.where, ...myFilter }

        filter.where = { and: [{ dealId: { inq: dealsIds } }, filter.where] };
      } else {
        filter.where = { and: [{ dealId: { inq: dealsIds } }, { time: { lte: now.toISOString() } }] };
      }
    } else {
      filter = { where: { and: [{ dealId: { inq: dealsIds } }, { time: { lte: now.toISOString() } }] } };
    }

    let services = await await this.serviceRepository.find(filter);
    let total = await this.serviceRepository.count(filter.where);

    return { data: services, total: total.count }

    // const sql = `SELECT s.id, s.service_user_id as serviceUserId, s.time, s.done_date as doneDate, s.start_time AS startTime,
    //   s.finish_time as finishTime, s.service_user_report as serviceUserReport, s.customer_description AS customerDescription,
    //   s.service_user_reminder AS serviceUserReminder, d.id as dealId
    //   FROM services s
    //   LEFT JOIN deals d ON d.id = s.deal_id
    //   WHERE d.company_user_id = ${currentUser.id}
    //   order by s.id desc`;

    // return await this.serviceRepository.query(sql);
  }

  @patch('/services', {
    responses: {
      '200': {
        description: 'Service PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, { partial: true }),
        },
      },
    })
    service: Service,
    @param.query.object('where', getWhereSchemaFor(Service)) where?: Where<Service>,
  ): Promise<Count> {
    return await this.serviceRepository.updateAll(service, where);
  }

  @get('/services/{id}', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Service> {
    return await this.serviceRepository.findById(id);
  }

  @patch('/services/{id}', {
    responses: {
      '204': {
        description: 'Service PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, { partial: true }),
        },
      },
    })
    service: Service,
  ): Promise<Service> {

    delete service.dealId;
    delete service.serviceUserId;

    if (service.serviceUserReport !== null) {
      service.status = "done";
    }

    //update service
    await this.serviceRepository.updateById(id, service);

    //delete prev service checklists, segments and factors
    await this.serviceChecklistRepository.deleteAll({ serviceId: service.id });
    await this.serviceSegmentRepository.deleteAll({ serviceId: service.id });
    await this.serviceFactorRepository.deleteAll({ serviceId: service.id });

    //add service checklists
    let serviceChecklists: ServiceChecklist[] = [];
    service.checklists && service.checklists.forEach(checklist => {

      if (checklist.status !== null) {
        let serviceChecklist = new ServiceChecklist();
        serviceChecklist.checklistId = checklist.id;
        serviceChecklist.serviceId = service.id;
        serviceChecklist.status = checklist.status;

        serviceChecklists.push(serviceChecklist)
      }

    });
    if (serviceChecklists.length > 0) {
      await this.serviceChecklistRepository.createAll(serviceChecklists);
    }

    //add service segments
    let serviceSegments: ServiceSegment[] = [];
    let factorCost: number = 0;
    service.segments && service.segments.forEach(segment => {
      let serviceSegment = new ServiceSegment();
      serviceSegment.segmentId = segment.id;
      serviceSegment.serviceId = service.id;
      serviceSegment.status = segment.status;
      serviceSegment.count = segment.count;
      serviceSegment.singleCost = segment.price;
      let cost: number = (segment.price != undefined && segment.count != undefined) ? (segment.price * segment.count) : 0;
      serviceSegment.cost = cost;
      factorCost += cost;

      serviceSegments.push(serviceSegment)
    });
    if (serviceSegments.length > 0) {
      await this.serviceSegmentRepository.createAll(serviceSegments);
    }

    //add service factor
    if (serviceSegments.length > 0) {

      let serviceFactor = new ServiceFactor()
      serviceFactor.serviceId = service.id;
      serviceFactor.cost = factorCost;
      serviceFactor.status = (service.serviceFactors !== null && service.serviceFactors.length > 0) ? service.serviceFactors[0].status : "submitted";
      await this.serviceFactorRepository.create(serviceFactor);
    }

    return service;
  }

  @put('/services/{id}', {
    responses: {
      '204': {
        description: 'Service PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() service: Service,
  ): Promise<void> {
    await this.serviceRepository.replaceById(id, service);
  }

  @del('/services/{id}', {
    responses: {
      '204': {
        description: 'Service DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/services/filter', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async filter(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody() serviceFilter: ServiceFilter
  ): Promise<any> {

    let where = '';
    if (serviceFilter.appType == "customer") {
      where += `WHERE d.customer_id = '${currentUser.id}'`;
    } else {
      where += `WHERE s.service_user_id = '${currentUser.id}'`;
    }

    if (serviceFilter.status && serviceFilter.status !== "") {
      if (serviceFilter.status == "done") {
        where += ` AND s.status = 'done'`;
      } else {
        where += ` AND (s.status LIKE 'undone' OR s.status LIKE 'submitted' OR s.status IS NULL)`;
      }
    }

    if (where !== '') {
      if (serviceFilter.dealId && serviceFilter.dealId !== 0) {
        where += ` AND s.deal_id = '${serviceFilter.dealId}'`;
      }
    }

    if (where !== '') {
      if (serviceFilter.date && serviceFilter.date !== "") {
        let startDate = jMoment(serviceFilter.date + ' 00:00', 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')
        let endDate = jMoment(serviceFilter.date + ' 23:59', 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')
        where += ` AND s.time BETWEEN '${startDate}' AND '${endDate}'`;
      }
    }

    const sql = `SELECT s.id as id, s.created_on as createdOn, s.service_user_id AS serviceUserId,
      s.time, s.start_time as startTime, s.finish_time as finishTime, s.service_user_report as serviceUserReport,
      s.customer_description as customerDescription, s.service_user_reminder as serviceUserReminder,
      s.status, dt.title as deviceType
      FROM services s
      LEFT JOIN deals d ON d.id = s.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      LEFT JOIN device_types dt ON dt.id = l.device_type_id
      ${where}
      order by s.id desc`;

    let s = await this.serviceRepository.query(sql);

    return s;
  }

  @authenticate('jwt')
  @get('/services/getDetail/{id}', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async getDetail(
    @param.path.number('id') id: number
  ): Promise<Service> {

    let service = await this.serviceRepository.findById(id);
    service.deal = await this.serviceRepository.deal(id);

    try {
      service.deal.lift = await this.dealRepository.lift(service.deal.id).get();
      service.deal.lift.deviceType = await this.liftRepository.deviceType(service.deal.lift.id);
      service.serviceUser = await this.serviceRepository.serviceUser(id);
    } catch {

    }

    if (service.status == "done") {
      // let serviceChecklists = await this.serviceRepository.serviceChecklists(service.id).find();

      // //add checklist
      // await Promise.all(
      //   serviceChecklists.map(async sc => {
      //     try {
      //       const sql = `SELECT c.id, c.title, c.priority, c.status, clc.title AS checkListCategoryTitle, clc.priority AS checkListCategoryPriority
      //         FROM checklists c
      //         LEFT JOIN checklist_categories clc ON c.checklist_category_id = checklist_categories.id
      //         WHERE c.id = ${sc.checklistId}
      //         ORDER BY clc.priority ASC, c.priority ASC`;

      //       let checklist = await this.checklistRepository.query(sql);
      //       sc.checklist = checklist[0];
      //     } catch {

      //     }
      //   }),
      // );

      // service.serviceChecklists = serviceChecklists;

      try {
        const sql = `SELECT c.id, c.title, c.priority, clc.title AS checkListCategoryTitle,
          clc.priority AS checkListCategoryPriority, sc.status, CASE WHEN sc.status IS NULL THEN false ELSE true END AS isChecked , sc.description
          FROM checklists c
          LEFT JOIN checklist_categories clc ON c.checklist_category_id = clc.id
          LEFT JOIN service_checklists sc ON (sc.checklist_id = c.id AND sc.service_id = ${service.id})
          WHERE clc.company_user_id = ${service.deal.companyUserId}
          GROUP BY c.id
          ORDER BY clc.priority ASC, c.priority ASC`;

        let checklist = await this.checklistRepository.query(sql);
        service.checklists = checklist;
      } catch (ex) {
        // console.log(ex);

      }

      //service segment items
      // let serviceSegments = await this.serviceRepository.serviceSegments(service.id).find();
      // await Promise.all(
      //   serviceSegments.map(async ss => {
      //     try {
      //       ss.segment = await this.serviceSegmentRepository.segment(ss.id);
      //     } catch {

      //     }
      //   }),
      // );
      // service.serviceSegments = serviceSegments;

      try {
        const sql = `SELECT s.id, s.name, s.country, s.brand,
          s.price, ss.count, ss.status, ss.single_cost as singleCost,
          ss.cost, ss.id as serviceSegmentId
          FROM segments s
          LEFT JOIN service_segments ss ON ss.segment_id = s.id
          WHERE s.company_user_id = ${service.deal.companyUserId}
          AND ss.service_id = ${service.id}
          ORDER BY s.id ASC`;

        let segments = await this.segmentRepository.query(sql);
        service.segments = segments;
      } catch (ex) {
        // console.log(ex);

      }

      //service factor items
      let serviceFactors = await this.serviceRepository.serviceFactors(service.id).find();
      service.serviceFactors = serviceFactors;
    }

    // console.log(service);

    return service;
  }

  @post('/services/{id}/service-segments', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceSegment } } },
      },
    },
  })
  async addSegment(
    @param.path.number('id') id: typeof Service.prototype.id,
    @requestBody() serviceSegment: ServiceSegment,
  ): Promise<ServiceSegment> {

    let serviceSegments = await this.serviceSegmentRepository.find(
      {
        where: {
          serviceId: id,
          segmentId: serviceSegment.segmentId,
        }
      }
    );

    if (serviceSegments.length > 0) {

      let count: (number | undefined) = (serviceSegment.count != undefined && serviceSegments[0].count !== undefined) ? (serviceSegment.count + serviceSegments[0].count) : 0;
      let cost: (number | undefined) = (serviceSegments[0].singleCost !== undefined) ? (serviceSegments[0].singleCost * count) : 0;
      await this.serviceSegmentRepository.updateById(serviceSegments[0].id, { count: count, cost: cost })

    } else {
      let segment = await this.segmentRepository.findById(serviceSegment.segmentId);
      serviceSegment.singleCost = segment.price;
      serviceSegment.status = "1";
      serviceSegment.cost = (segment.price != undefined && serviceSegment.count !== undefined) ? segment.price * serviceSegment.count : 0;
      await this.serviceRepository.serviceSegments(id).create(serviceSegment);
    }

    let thisServiceSegments = await this.serviceSegmentRepository.find({ where: { serviceId: id } });
    let factorCost = 0;
    thisServiceSegments.forEach(ss => {
      factorCost += ss.cost !== undefined ? ss.cost : 0;
    });

    //delete prev service factor
    await this.serviceFactorRepository.deleteAll({ serviceId: id });

    //update service factor
    let serviceFactor = new ServiceFactor()
    serviceFactor.serviceId = id;
    serviceFactor.cost = factorCost;
    serviceFactor.status = "submitted";

    await this.serviceFactorRepository.create(serviceFactor);

    return serviceSegment;
  }

  @del('/services/delete-service-segments/{id}', {
    responses: {
      '200': {
        description: 'Service.ServiceSegment DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async deleteServiceSegment(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ServiceSegment)) where?: Where<ServiceSegment>,
  ): Promise<Count> {

    let serviceSegment = await this.serviceSegmentRepository.findById(id);

    let deletedCount = await this.serviceSegmentRepository.deleteAll({ id: id });

    let thisServiceSegments = await this.serviceSegmentRepository.find({ where: { serviceId: serviceSegment.serviceId } });
    let factorCost = 0;
    thisServiceSegments.forEach(ss => {
      factorCost += ss.cost !== undefined ? ss.cost : 0;
    });

    //delete prev service factor
    await this.serviceFactorRepository.deleteAll({ serviceId: serviceSegment.serviceId });

    //update service factor
    let serviceFactor = new ServiceFactor()
    serviceFactor.serviceId = serviceSegment.serviceId;
    serviceFactor.cost = factorCost;
    serviceFactor.status = "submitted";

    await this.serviceFactorRepository.create(serviceFactor);

    return deletedCount;
  }
}
