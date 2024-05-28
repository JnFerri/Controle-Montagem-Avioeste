
/**
 * Classe responsavel por fazer as requisições ao servidor que tem conexão com a API do jestor para pegar registros.
 */
export class PegarRegistrosTabela{
   /**
     * @constructor
     */
    constructor(){
      /**
     * Rota do para o servidor nodejs que interaje com o jestor para pegar os registros.
     * @type {string}
     * @private
     */
        this._url = `${process.env.REACT_APP_API_URL}/api/jestor/lista`
    }
    
    /**
     * Solicita ao servidor que ele retorne a lista de todos os dados dos registros de uma tabela do jestor.
     * @param {string} table Tabela jestor 
     * @returns Array com os dados dos registros da tabela jestor.
     * @throws Retorna erro caso algum erro aconteça na função após o numero maximo de tentativas.
     */
    async pegarRegistrosTabela(table){
      const delay = async (ms) => {return new Promise(resolve =>setTimeout(resolve,ms))}
      const maxTentativas = 30
      const dadosAcumulador = []
      var tentativaAtual = 0
      // Pega os dados paginados para não dar timeout no servidor do jestor.
      async function pegaDadoPaginado(url,page=1){
           try{
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_token}` 
               },
               body: JSON.stringify({object_type: table, sort: '',page : page, size : '20000'})
             })
            if(!response.ok){
              throw new Error (`Response not ok, status = ${response.status}`,)
            }
            const dados = await response.json()
            dadosAcumulador.push(...dados.data.items)
            //Se ainda possui dados ativa denovo a função adicionando + 1 a pagina.
            if (dados.data.has_more === true) {
              console.log(`Dados capturados, pagina ${page}`)
             return pegaDadoPaginado(url, page + 1);
           } else {
             return dadosAcumulador;
           }
          }
           catch(error){
            //Caso erro tenta repetir a função para tentar corrigir enquanto tentativa atual é menor que o maxTentativas.
             if(tentativaAtual <maxTentativas){
              tentativaAtual++
              console.log(`Erro ${error} ao coletar os dados !!!`)
              console.log(`Tentando Novamente fazer a captura dos dados, tentativa ${tentativaAtual}, maximo de ${maxTentativas}`)
              await delay(10000)
            return await pegaDadoPaginado(url, page)}
            else{
              console.log(error)
              throw error
            }
             
       }
     }
     const todosDados = await pegaDadoPaginado(this._url)
     console.log(`Captura da lista de dados jestor concluida, total de ${todosDados.length} dados`)
     return todosDados
     }
    }