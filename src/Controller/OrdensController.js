import { AtualizaRegistro } from "../Services/AtualizaRegistro.js"
import { CriarRegistro } from "../Services/CriarRegistro.js"
import { PegarRegistrosTabela } from "../Services/PegaRegistrosTabela.js"

/**
 * Classe Responsavel por manter os metodos que interagem com o servidor através dos services.
 *
 */
export class OrdensController{

  /**
   * @constructor
   */
  constructor(){
      /**
       * Instancia da classe PegarRegistrosTabela.
       * @type {PegarRegistrosTabela}
       * @private
       */
        this._pegarRegistrosTabela = new PegarRegistrosTabela(process.env.REACT_APP_token)

        /**
         * Instancia da classe CriarRegistro.
         * @type {CriarRegistro}
         * @private
         */
        this._criarRegistro = new CriarRegistro(process.env.REACT_APP_token)

        /**
         * Instancia da classe AtualizaRegistro.
         * @type {AtualizaRegistro}
         * @private
         */
        this._atualizarRegistro = new AtualizaRegistro(process.env.REACT_APP_token)
    }

    /**
     * Utiliza a o metodo criarRegistro da classe CriarRegistro para enviar os dados para o servidor local fazer a criação do registro na tabela e com os dados especificados no parametro.
     * @param {string} tabela Tabela jestor. Por exemplo em https://avioeste.jestor.com/object/9c6of6gvyn34owum60ty3 seria o '9c6of6gvyn34owum60ty3';
     * @param {object} dado Dados da ordem que será criado o registro.
     * @returns {Object} Retorna Objeto contendo os dados do registro criado e metadados da resposta da requisição a API do jestor.
     */
 async criarRegistro(tabela,dado){
   const dadoCriado = await this._criarRegistro.criarRegistro(tabela,dado)
   return dadoCriado
 }

    /**
     * Utiliza o metodo pegarRegistrosTabela da classe PegarRegistrosTabela para pegar todos os dados de uma tabela do jestor.
     * @param {string} tabela Tabela Jestor. Por exemplo em https://avioeste.jestor.com/object/9c6of6gvyn34owum60ty3 seria o '9c6of6gvyn34owum60ty3';
     * @returns {Array<Object>} Array com todos os dados da tabela.
     */
 async pegaDadosLista(tabela){
  const dado = await this._pegarRegistrosTabela.pegarRegistrosTabela(tabela)
  return dado
}

}