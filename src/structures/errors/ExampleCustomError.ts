import BaseError from  './BaseError'

export default class ExampleCustomError extends BaseError {
  constructor() {
    super('Erro customisado', 403)
  }
}