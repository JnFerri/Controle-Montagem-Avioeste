export class CriarRegistro{

    constructor(token){
        this._token = token
        this._url = "http://localhost:3000/api/proxy"
    }

  criarRegistro(tabela,dado) {
return new Promise((resolve,reject) => {
  
  fetch(this._url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.token} `
    },
    body : JSON.stringify({ 
      object_type: `${tabela}`,
      data: dado})
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao fazer a requisição.');
        }
        return response;
      
      }).then(response => console.log(response))
      .then(response => resolve(response))
.catch(err => {
  console.error('Ocorreu um erro:', err);
  reject(err)
}
)
})
}


                          
}
