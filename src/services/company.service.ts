import { repository } from '@loopback/repository';
import {
  CompanyRepository,
  UserRepository,
  UserRoleRepository,
  Credentials,
} from '../repositories';
import {
  Company,
  User,
  Role,
  UserWithRole,
  CompanyWithUser,
  UserRole,
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

export class CompanyService {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) { }

  @transactional()
  async create(
    company: CompanyWithUser,
    throwError: boolean,
    options?: Object,
  ): Promise<Company> {
    let user = new UserWithRole();
    user.username = company.username;
    user.firstName = company.title;
    // encrypt the password
    user.password = await this.passwordHasher.hashPassword(company.password);

    //empty permissions
    user.permissions = [];

    // create company role
    const userRole = new UserRole();
    userRole.roleId = company.role;

    // create the new user
    delete user.role;
    const savedUser = await this.userRepository.create(user, options);

    userRole.userId = savedUser.id;

    await this.userRoleRepository.create(userRole, options);

    delete company.username;
    delete company.password;
    delete company.role;

    company.userId = savedUser.id ? savedUser.id : 0;
    company.latitude = company.location.split(":")[0];
    company.longitude = company.location.split(":")[1];
    const company_object = await this.companyRepository.create(
      company,
      options,
    );

    if (throwError) {
      throw new Error(
        'Error after create user & company. Transaction is rollback.',
      );
    }

    return company_object;
  }

  // @transactional()
  // async callCreateMethod(
  //   user: User,
  //   company: Company,
  //   throwError: boolean,
  //   options?: Object,
  // ): Promise<{user: User; company: Company}> {
  //   await this.userRepository.create(user, options);
  //   // Pass options here will propagate transaction as well
  //   return this.create(user, company, throwError, options);
  // }

  async listUserAndCompany() {
    const users = await this.userRepository.find();
    const companys = await this.companyRepository.find();

    return { users, companys };
  }
}
