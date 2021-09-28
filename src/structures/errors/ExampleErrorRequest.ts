import BaseError from './BaseError'

export class ExampleErrorRequest extends BaseError {
  constructor () {
    super('Exemplo de erro 2', 400)
    this.statusCode = 400
    this.code = 'EX_ERR_01' // codigo do erro se existir
  }
}

export default ExampleErrorRequest