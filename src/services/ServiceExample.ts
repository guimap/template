import {inject, injectable} from "tsyringe";
import ExampleErrorRequest from "../structures/errors/ExampleErrorRequest"
import ExampleCustomError from "../structures/errors/ExampleCustomError";
import RepositoryExample from "../repositories/RepositoryExample";

@injectable()
export default class ServiceExample {
  constructor(
    private repositoryExample?: RepositoryExample
  ) {

  }
  public throwAnError (): void {
    throw new ExampleErrorRequest()
  }

  public throwACustomError (): void {
    throw new ExampleCustomError()
  }

  public async welcomeUser(name: string): Promise<string> {
    // Emulate an insert
    await this.repositoryExample.save(name)
    return `Welcome ${name}!`
  }
}