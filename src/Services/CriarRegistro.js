export class CriarRegistro{

    constructor(token){
        this._token = token
        this._url = "http://localhost:3000/api/proxy"
    }

  criarRegistro(tabela,dado) {
return new Promise((resolve,reject) => {

    
  /*const options =  {

      method: 'POST',
      headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        Authorization: `Bearer ${this._token} `,

      },
      body:  JSON.stringify({ 
          object_type: `${tabela}`,
          data: dado})
      };*/

  fetch(this._url,{method: 'POST'})
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao fazer a requisição.');
        }
        return response;
      
      })
      .then(response => resolve(response))
.catch(err => {
  console.error('Ocorreu um erro:', err);
  reject(err)
}
)
})
}


                          
}
