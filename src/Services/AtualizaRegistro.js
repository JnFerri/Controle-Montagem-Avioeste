export class AtualizaRegistro{
    constructor(token){
        this._token = token
        this._url = 'https://avioeste.api.jestor.com/object/update'
    }

atualizaRegistro(tabela,data){
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${this._token}`
        },
        body: JSON.stringify({
          object_type: tabela,
          data: data
        })
      };
      
      fetch(this._url, options)
        .then(response => response.json())
        .then(response => console.log(`Dado id_jestor = ${response.data[`id_${tabela}`]} Atualizado `))
        .catch(err => console.error(err));
}
} 