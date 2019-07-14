import { repository } from '@loopback/repository';
import {
  CompanyRepository,
  UserRepository,
  UserRoleRepository,
  Credentials,
  DealRepository,
  InsuranceRepository,
  LiftRepository,
  LiftFieldValueRepository,
  ServiceRepository,
} from '../repositories';
import {
  Company,
  User,
  Role,
  UserWithRole,
  CompanyWithUser,
  UserRole,
  FullDeal,
  Insurance,
  Deal,
  Lift,
  LiftField,
  LiftFieldValue,
  Service,
} from '../models';
import { transactional } from 'loopback4-spring';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import { PasswordHasher } from './hash.password.bcryptjs';
import { TokenService, UserService } from '@loopback/authentication';
import { inject } from '@loopback/core';
var moment = require('moment-jalaali');

export class DealService {
  constructor(
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(InsuranceRepository)
    public insuranceRepository: InsuranceRepository,
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
    @repository(LiftFieldValueRepository)
    public liftFieldValueRepository: LiftFieldValueRepository,
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) { }

  @transactional()
  async create(
    fulldeal: FullDeal,
    userId: number,
    throwError: boolean,
    options?: Object,
  ): Promise<Deal> {

    let deal = new Deal();
    deal.previousDebt = fulldeal.previousDebt;
    deal.repairManId = fulldeal.repairManId;
    deal.secondName = fulldeal.secondName;
    deal.serviceDay = fulldeal.serviceDay;
    deal.serviceTimeType = fulldeal.serviceTimeType;
    deal.serviceUserId = fulldeal.serviceUserId;
    deal.warrantyFinishDate = fulldeal.warrantyFinishDate;
    deal.address = fulldeal.address;
    deal.buildingLatitude = fulldeal.location.split(":")[0];
    deal.buildingLongitude = fulldeal.location.split(":")[1];
    deal.buildingLocation = fulldeal.location;
    deal.buildingName = fulldeal.buildingName;
    deal.buildingRegion = fulldeal.buildingRegion;
    deal.companyUserId = userId;
    deal.contractNumber = fulldeal.contractNumber;
    deal.contractStartDate = fulldeal.contractStartDate;
    deal.contractFinishDate = fulldeal.contractFinishDate;
    deal.costPerService = fulldeal.costPerService;
    deal.customerId = fulldeal.customerId;
    deal.description = fulldeal.description;
    deal.discount = fulldeal.discount;
    deal.fullDealCost = fulldeal.fullDealCost;
    deal.hasResidentServiceUser = fulldeal.hasResidentServiceUser;
    deal.hasTwoMonthService = fulldeal.hasTwoMonthService;

    let savedDeal = await this.dealRepository.create(deal, options);

    //save insurance
    if (fulldeal.insuranceNumber) {
      let insurance = new Insurance();
      insurance.insuranceNumber = fulldeal.insuranceNumber;
      insurance.cost = fulldeal.cost;
      insurance.startDate = fulldeal.startDate;
      insurance.finishDate = fulldeal.finishDate;
      insurance.addDealCost = fulldeal.addDealCost;

      insurance.dealId = savedDeal.id;
      await this.insuranceRepository.create(insurance, options);
    }

    //save lift info
    let lift = new Lift();
    lift.capacity = fulldeal.capacity;
    lift.deviceTypeId = fulldeal.deviceTypeId;
    lift.liftType = fulldeal.liftType;
    lift.stopsCount = fulldeal.stopsCount;
    lift.nationalId = fulldeal.nationalId;

    lift.dealId = savedDeal.id;
    let savedLift = await this.liftRepository.create(lift, options);

    await Object.keys(fulldeal.field).forEach(async (key, index) => {
      let liftField = new LiftFieldValue();
      liftField.liftId = savedLift.id;
      liftField.liftFieldId = Number(key.split("_")[1]);
      liftField.value = fulldeal.field[key];

      await this.liftFieldValueRepository.create(liftField, options);
    });

    //save deal services
    let contractStartDate: string = fulldeal.contractStartDate.split("T")[0];
    contractStartDate = moment(contractStartDate, 'YYYY-M-D').format('jYYYY-jM-jD')
    let startDate: string[] = contractStartDate.split("-");

    let contractEndDate: string = fulldeal.contractFinishDate.split("T")[0];
    contractEndDate = moment(contractEndDate, 'YYYY-M-D').format('jYYYY-jM-jD')
    let endDate: string[] = contractEndDate.split("-");

    let dates = [];

    //same years
    if (startDate[0] == endDate[0]) {

      for (let month: number = Number(startDate[1]); month <= Number(endDate[1]); month++) {

        if (month == Number(startDate[1]) && fulldeal.serviceDay < Number(startDate[2])) {
          continue;
        }

        dates.push({
          year: Number(startDate[0]),
          month: month,
          day: fulldeal.serviceDay
        });
      }
    } else {

      for (let year: number = Number(startDate[0]); year <= Number(endDate[0]); year++) {

        if (year == Number(startDate[0])) {
          for (let month: number = Number(startDate[1]); month <= 12; month++) {

            if (month == Number(startDate[1]) && fulldeal.serviceDay < Number(startDate[2])) {
              continue;
            }

            dates.push({
              year: year,
              month: month,
              day: fulldeal.serviceDay,
            });
          }
        }
        else if (year < Number(endDate[0])) {
          for (let month1 = 1; month1 <= 12; month1++) {
            dates.push({
              year: year,
              month: month1,
              day: fulldeal.serviceDay,
            });
          }
        }
        else if (year == Number(endDate[0])) {
          for (let month2: number = 1; month2 <= Number(endDate[1]); month2++) {
            dates.push({
              year: year,
              month: month2,
              day: fulldeal.serviceDay,
            });
          }
        }
      }
    }

    await dates.forEach(async (date, index) => {
      let service = new Service();
      service.serviceUserId = fulldeal.serviceUserId;
      //cast date to gregorian date
      service.time = moment(`${date.year}-${date.month}-${date.day}`, 'jYYYY/jM/jD').format('YYYY-M-D');
      service.status = "submitted";
      service.dealId = savedDeal.id;

      await this.serviceRepository.create(service, options);
    });

    if (throwError) {
      throw new Error(
        'Error after create user & company. Transaction is rollback.',
      );
    }

    return savedDeal;
  }

  @transactional()
  async update(
    id: Number,
    fulldeal: FullDeal,
    userId: number,
    throwError: boolean,
    options?: Object,
  ): Promise<void> {

    let deal = new Deal();
    deal.previousDebt = fulldeal.previousDebt;
    deal.repairManId = fulldeal.repairManId;
    deal.secondName = fulldeal.secondName;
    deal.serviceDay = fulldeal.serviceDay;
    deal.serviceTimeType = fulldeal.serviceTimeType;
    deal.serviceUserId = fulldeal.serviceUserId;
    deal.warrantyFinishDate = fulldeal.warrantyFinishDate;
    deal.address = fulldeal.address;
    deal.buildingLatitude = fulldeal.location.split(":")[0];
    deal.buildingLongitude = fulldeal.location.split(":")[1];
    deal.buildingLocation = fulldeal.location;
    deal.buildingName = fulldeal.buildingName;
    deal.buildingRegion = fulldeal.buildingRegion;
    deal.companyUserId = userId;
    deal.contractNumber = fulldeal.contractNumber;
    deal.contractStartDate = fulldeal.contractStartDate;
    deal.contractFinishDate = fulldeal.contractFinishDate;
    deal.costPerService = fulldeal.costPerService;
    deal.customerId = fulldeal.customerId;
    deal.description = fulldeal.description;
    deal.discount = fulldeal.discount;
    deal.fullDealCost = fulldeal.fullDealCost;
    deal.hasResidentServiceUser = fulldeal.hasResidentServiceUser;
    deal.hasTwoMonthService = fulldeal.hasTwoMonthService;

    let updatedDeal = await this.dealRepository.updateById(fulldeal.id, deal, options);

    //save insurance
    if (fulldeal.insuranceNumber) {
      let insurance = new Insurance();
      insurance.insuranceNumber = fulldeal.insuranceNumber;
      insurance.cost = fulldeal.cost;
      insurance.startDate = fulldeal.startDate;
      insurance.finishDate = fulldeal.finishDate;
      insurance.addDealCost = fulldeal.addDealCost;
      insurance.dealId = fulldeal.id;

      if (fulldeal.insuranceId) {
        await this.insuranceRepository.updateById(fulldeal.insuranceId, insurance, options);
      } else {
        await this.insuranceRepository.create(insurance, options);
      }
    }

    //save lift info
    let lift = new Lift();
    lift.capacity = fulldeal.capacity;
    lift.deviceTypeId = fulldeal.deviceTypeId;
    lift.liftType = fulldeal.liftType;
    lift.stopsCount = fulldeal.stopsCount;
    lift.nationalId = fulldeal.nationalId;

    if (fulldeal.liftId) {
      await this.liftRepository.updateById(fulldeal.liftId, lift, options);
    } else {
      lift.dealId = fulldeal.id;
      await this.liftRepository.create(lift, options);
    }

    await Object.keys(fulldeal.field).forEach(async (key, index) => {
      let liftField = new LiftFieldValue();
      liftField.liftFieldId = Number(key.split("_")[1]);
      liftField.value = fulldeal.field[key] == null ? "" : fulldeal.field[key];
      liftField.liftId = fulldeal.liftId;

      if (key.split("_")[2] == "null") {
        await this.liftFieldValueRepository.create(liftField, options);

      } else {
        await this.liftFieldValueRepository.updateById(Number(key.split("_")[2]), liftField, options);

      }
    });


    if (throwError) {
      throw new Error(
        'Error after create user & company. Transaction is rollback.',
      );
    }

  }
}
