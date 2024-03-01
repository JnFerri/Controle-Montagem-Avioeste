export class CriarRegistro{

    constructor(token){
        this._token = token
        this._url = "http://localhost:3000/api/proxy"
    }

  criarRegistro(tabela,dado) {
return new Promise((resolve,reject) => {
  console.log(process.env.REACT_APP_token)
  fetch(this._url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx `
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
