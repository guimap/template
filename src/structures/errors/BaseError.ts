export default class Base extends Error {
  public statusCode: number
  public code ?: string // Codigo do erro (se existir)
  
  /**
   * @constructor
   * @param {string} message - Messagem do erro
   * @param {number} statusCode - HTTP STATUS do erro
   * @param {number} code - Código do erro, ex: ERR_01
   */
  constructor(message: string, statusCode: number, code?: string ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}