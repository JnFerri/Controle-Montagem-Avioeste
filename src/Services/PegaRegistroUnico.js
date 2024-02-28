export class PegaRegistroUnico{
    constructor(token){
        this._token = token
        this._url = `https://avioeste.api.jestor.com/object/describe`
    }

    PegaRegistroUnico(table, id){
        return new Promise((resolve,reject) => {
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              Authorization: `Bearer ${this._token}`
            },
            body: JSON.stringify({object_type: `${table}`, id: id,summarized: true})
          };
          
          fetch(`${this._url}`, options)
          .then(
            response => { return response.json()} 
            )
          .then(data => {
              resolve(data);
            })
            .catch(error => reject(`algum problema na operação fetchSpecificRecord na tabela : ${table} erro : ${error}`))});
    }
}