export class PegarRegistrosTabela{
    constructor(token){
        this._token = token
        this._url = `https://avioeste.api.jestor.com/object/list`
    }
    
    async pegarRegistrosTabela(table,sort){
      const delay = async (ms) => {return new Promise(resolve =>setTimeout(resolve,ms))}
      const maxTentativas = 30
      const dadosAcumulador = []
      var tentativaAtual = 0
      async function pegaDadoPaginado(token, url,page=1){
           try{
           const options = {
             method: 'POST',
             headers: {
               accept: 'application/json',
               'content-type': 'application/json',
               Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({object_type: table, sort: sort,page : page, size : '1000'})
            };
            
            const response = await fetch(url, options)
            if(!response.ok){
              throw new Error (`Response not ok, status = ${response.status}`,)
            }
            const dados = await response.json()
            dadosAcumulador.push(...dados.data.items)
            if (dados.data.has_more === true) {
              console.log(`Dados capturados, pagina ${page}`)
             return pegaDadoPaginado(token, url, page + 1);
           } else {
             return dadosAcumulador;
           }
          }
           catch(error){
             if(tentativaAtual <maxTentativas){
              tentativaAtual++
              console.log(`Erro ${error} ao coletar os dados !!!`)
              console.log(`Tentando Novamente fazer a captura dos dados, tentativa ${tentativaAtual}, maximo de ${maxTentativas}`)
              await delay(10000)
            return await pegaDadoPaginado(token, url, page)}
            else{
              console.log(error)
              throw error
            }
             
       }
     }
     const todosDados = await pegaDadoPaginado(this._token, this._url)
     console.log(`Captura da lista de dados jestor concluida, total de ${todosDados.length} dados`)
     return todosDados
     }
    }