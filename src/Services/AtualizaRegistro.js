export class AtualizaRegistro{
    constructor(token){
        this._token = token
        this._url = `${process.env.REACT_APP_API_URL}/api/jestor/atualiza`
    }
    
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