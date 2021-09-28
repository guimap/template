import ILog from "../structures/ILog"
import { inject, injectable } from "tsyringe"


@injectable()
export default class RepositoryExample {
  constructor(
    @inject('db') private db,
    @inject('log') private log: ILog
  ) {

  }

  async save (user: string) {
    //  USE this.tb to save
    this.log.info('Saving user')
    return user
  }
}