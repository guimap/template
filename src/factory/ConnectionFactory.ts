import { injectable, inject } from 'tsyringe'
import { IAppConfig } from "../app-config";

@injectable()
export default class ConnectionFactory {
  constructor (
    @inject("appConfig") private appConfig: IAppConfig
  ) {}

  static async createConnection(type: 'mysql'| 'mongodb'): Promise<any> {
    if (type === 'mysql') return Promise.resolve('Connected in mysql')
    if (type === 'mongodb') return Promise.resolve('Connected in mongodb')
  }
}