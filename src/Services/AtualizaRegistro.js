
/**
 * Classe responsavel por fazer as requisições ao servidor que tem conexão com a API do jestor para atualizar um registro.
 * @deprecated Não é utilizado no momento, mantido na aplicação caso necessario uso futuro.
 */
export class AtualizaRegistro{
  /**
   * @constructor
   */
    constructor(){
      /**
       * Rota do para o servidor nodejs que interaje com o jestor para fazer atualizações nos registros. 
       * @type {string}
       * @private
       */
        this._url = `${process.env.REACT_APP_API_URL}/api/jestor/atualiza`
    }
    
    /**
     * Envia os dados para o servidor atualizar um registro no jestor.
     * @param {string} tabela Tabela jestor. Por exemplo em https://avioeste.jestor.com/object/9c6of6gvyn34owum60ty3 seria o '9c6of6gvyn34owum60ty3'
     * @param {Object} dados Objeto contendo os dados que precisam ser atualizados, necessario entre os dados possuir o id do registro a ser atualizado.
     */
atualizaRegistro(tabela,dados){
      
      fetch(this._url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_token}`
        },
        body: JSON.stringify({
          object_type: tabela,
          data: dados
        })
      })
        .then(response => response).then(response => console.log(response))
        .catch(err => console.error(err));
}
} 