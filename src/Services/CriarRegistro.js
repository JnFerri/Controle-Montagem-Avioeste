
/**
 * Classe responsavel por fazer as requisições ao servidor que tem conexão com a API do jestor para criar um registro.
 */
export class CriarRegistro{
    /**
     * @constructor
     */
    constructor(){
    /**
     * Rota do para o servidor nodejs que interaje com o jestor para fazer criação de registros.
     * @type {string}
     * @private
     */
        this._url = `${process.env.REACT_APP_API_URL}/api/ordens/post`
    }

    /**
     * Envia os dados para o servidor criar um registro no jestor.
     * @param {string} tabela Tabela jestor.  Por exemplo em https://avioeste.jestor.com/object/9c6of6gvyn34owum60ty3 seria o '9c6of6gvyn34owum60ty3'
     * @param {Object} dado Dados que serão salvos no jestor.
     * @returns {Object} Retorna Objeto contendo os dados do registro criado e metadados da resposta da requisição a API do jestor.
     */
  criarRegistro(tabela,dado) {
return new Promise((resolve,reject) => {
  fetch(this._url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_token}`
    },
    body : JSON.stringify({ 
      object_type: `${tabela}`,
      data: dado})
    }).then(response => {
      // Verifica se a requisição foi bem-sucedida (status 2xx)
      if (response.ok) {
          // Se sim, retorna os dados da resposta como JSON
          return response.json();
      }
      // Se não, rejeita a Promise com o status de erro
      return Promise.reject(new Error(`Erro: ${response.statusText}`));
  }).then(data => {
      // Resolve a Promise com os dados da resposta
      resolve(data);
  })
  .catch(err => {
    resolve({error:`Ocorreu um erro ao criar o registro no jestor, possivelmente ordem ja foi lançada, erro : ${err}`})
    reject('Ocorreu um erro ao criar o registro no Jestor. Possivelmente Esta ordem de produção ja existe no Jestor, contate o administrador:', err)
  })
  })
  }

                          
  }
