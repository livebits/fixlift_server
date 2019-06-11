import {DataSource} from 'loopback-datasource-juggler';

export default class RepositoryHelper {
  public dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<void> {
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
