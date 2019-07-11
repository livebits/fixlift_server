import { DefaultCrudRepository } from '@loopback/repository';
import { CompanyMessageTemplate, CompanyMessageTemplateRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class CompanyMessageTemplateRepository extends DefaultCrudRepository<
  CompanyMessageTemplate,
  typeof CompanyMessageTemplate.prototype.id,
  CompanyMessageTemplateRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(CompanyMessageTemplate, dataSource);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(CompanyMessageTemplate & CompanyMessageTemplateRelations)[]> {
    return new Promise((resolve, reject) => {
      const connector = this.dataSource.connector!;
      connector.execute!(sql, params, options, (err: any, ...results: any) => {
        if (err) {
          return reject(err);
        }

        if (results.length === 0) {
          return resolve();
        }

        if (results.length === 1) {
          return resolve(results[0]);
        }

        if (getIndex) {
          return resolve(results[getIndex]);
        }

        resolve(results);
      });
    });
  }
}
