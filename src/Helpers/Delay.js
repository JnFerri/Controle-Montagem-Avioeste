
/**
 * Função utilizada em funções assincronas para esperar um tempo. Utilizada principalmente antes de fazer requisições a API's para evitar sobrecarga.
 * @param {number} ms Quantidade de milisegundos que a função rodará. 
 * @returns Promisse vazia.
 */
export default function Delay(ms){
    return new Promise(resolve =>setTimeout(resolve,ms))
     }