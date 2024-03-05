export class CriarRegistro{

    constructor(token){
        this._token = token
        this._url = "http://localhost:3000/api/ordens/post"
    }

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
    console.error('Ocorreu um erro:', err);
    reject(err)
  })
  })
  }

                          
  }
