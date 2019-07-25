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
import {
  Company,
  CompanyWithUser,
  User,
  UserRole,
  UserWithRole,
  Role,
  Customer,
} from '../models';
import {
  CompanyRepository,
  Credentials,
  UserRepository,
  UserRoleRepository,
} from '../repositories';
import { intercept, inject } from '@loopback/core';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import { PasswordHasher } from '../services/hash.password.bcryptjs';
import { TokenService, UserService, authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { CompanyService } from '../services/company.service';
import { service } from 'loopback4-spring';

class CompanyWithUserAndRole {
  user: User;
  role: Role;
  company: Company;
}

export class CompanyController {
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
    @service(CompanyService)
    private companyService: CompanyService,
  ) { }

  @post('/companies', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  @intercept('CompanyUniqueUsername')
  async create(@requestBody() company: CompanyWithUser): Promise<Company> {
    return await this.companyService.create(company, false);
  }

  @get('/companies/count', {
    responses: {
      '200': {
        description: 'Company model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Company))
    where?: Where<Company>,
  ): Promise<Count> {
    return await this.companyRepository.count(where);
  }

  @get('/companies', {
    responses: {
      '200': {
        description: 'Array of Company model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Company))
    filter?: Filter<Company>,
  ): Promise<any> {
    // await this.companyRepository.find(filter);

    const sql = `select c.id, c.title, c.mobile, c.phone, c.address, c.status, u.username, r.id as role
      from companies c
      left join users u on c.user_id = u.id
      left join user_roles ur on ur.user_id = u.id
      left join roles r on r.id = ur.role_id
      order by c.id desc`;

    return await this.companyRepository.query(sql);
  }

  @patch('/companies', {
    responses: {
      '200': {
        description: 'Company PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() company: Company,
    @param.query.object('where', getWhereSchemaFor(Company))
    where?: Where<Company>,
  ): Promise<Count> {
    return await this.companyRepository.updateAll(company, where);
  }

  @get('/companies/{id}', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<any> {
    // return await this.companyRepository.findById(id);

    const sql = `SELECT u.username, c.*, r.id AS role
      FROM companies c
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE c.id=${id}`;

    const r = await this.companyRepository.query(sql, [], [], 0);
    return r[0];
  }

  @patch('/companies/{id}', {
    responses: {
      '204': {
        description: 'Company PATCH success',
      },
    },
  })
  @intercept('CompanyUniqueUsername')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() company: CompanyWithUser,
  ): Promise<void> {
    // await this.companyRepository.updateById(id, company);

    await this.companyRepository.updateById(id, company);
    const userRole = new UserRole();
    userRole.userId = company.userId;
    userRole.roleId = company.role;
    await this.userRoleRepository.deleteAll({ userId: company.userId });
    await this.userRoleRepository.create(userRole);
  }

  @put('/companies/{id}', {
    responses: {
      '204': {
        description: 'Company PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() company: Company,
  ): Promise<void> {
    await this.companyRepository.replaceById(id, company);
  }

  @del('/companies/{id}', {
    responses: {
      '204': {
        description: 'Company DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.companyRepository.deleteById(id);
  }

  @authenticate('jwt')
  @get('/companies/getDetail', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async getDetail(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Company> {
    let companies = await this.companyRepository.find({ where: { userId: Number(currentUser.id) } });
    return companies[0];

    // const sql = `SELECT u.username, c.*, r.id AS role
    //   FROM companies c
    //   LEFT JOIN users u ON u.id = c.user_id
    //   LEFT JOIN user_roles ur ON ur.user_id = u.id
    //   LEFT JOIN roles r ON r.id = ur.role_id
    //   WHERE c.id=${id}`;

    // const r = await this.companyRepository.query(sql, [], [], 0);
    // return r[0];
  }

  @authenticate('jwt')
  @patch('/companies/update', {
    responses: {
      '204': {
        description: 'Company PATCH success',
      },
    },
  })
  async updateCompany(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody() company: CompanyWithUser,
  ): Promise<void> {
    // await this.companyRepository.updateById(id, company);

    delete company.id;
    let currentCompany = await this.companyRepository.findOne({ where: { userId: Number(currentUser.id) } });

    if (currentCompany) {
      //update company info
      await this.companyRepository.updateById(currentCompany.id, company);

      //update password
      if (company.password != null && company.password != "") {
        let password = await this.passwordHasher.hashPassword(company.password);

        let user = new User();
        user.id = currentCompany.userId;
        user.password = password;
        await this.userRepository.updateById(currentCompany.userId, user);
      }
    }
  }
}
