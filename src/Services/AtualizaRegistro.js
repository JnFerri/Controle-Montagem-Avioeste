export class AtualizaRegistro{
    constructor(token){
        this._token = token
        this._url = 'http://localhost:3000/api/ordens/atualiza'
    }
    
atualizaRegistro(tabela,dados){
      
      fetch(this._url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx`
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