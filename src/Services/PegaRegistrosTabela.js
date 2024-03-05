export class PegarRegistrosTabela{
    constructor(token){
        this._token = token
        this._url = `http://localhost:3000/api/ordens/lista`
    }
    
    async pegarRegistrosTabela(table){
      const delay = async (ms) => {return new Promise(resolve =>setTimeout(resolve,ms))}
      const maxTentativas = 30
      const dadosAcumulador = []
      var tentativaAtual = 0
      async function pegaDadoPaginado(token, url,page=1){
           try{
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx` 
               },
               body: JSON.stringify({object_type: table, sort: '',page : page, size : '20000'})
             })
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