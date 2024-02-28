export class CriarRegistro{

    constructor(token){
        this._token = token
        this._url = "https://avioeste.api.jestor.com/object/create"
    }

  async CriarRegistro(table,dados) {

    const options =  {
        method: 'POST',
        headers: {
    
            accept: 'application/json',
            'content-type': 'application/json',
          Authorization: `Bearer ${this._token} `
        },
        body:  JSON.stringify({ 
            object_type: `${table}`,
            data: dados})
        };

    fetch(this._url, options)
        .then(response => response.json())
  .then(response =>  console.log(`Dado id_jestor = ${response.data[`id_${table}`]} Criado `))
  .catch(err => console.error(err))
}
                          
}
