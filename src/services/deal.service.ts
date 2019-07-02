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

    await this.liftRepository.updateById(fulldeal.liftId, lift, options);

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
