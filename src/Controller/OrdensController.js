import { AtualizaRegistro } from "../Services/AtualizaRegistro.js"
import { CriarRegistro } from "../Services/CriarRegistro.js"
import { PegarRegistrosTabela } from "../Services/PegaRegistrosTabela.js"


export class OrdensController{
    constructor(){
        this._pegarRegistrosTabela = new PegarRegistrosTabela(process.env.REACT_APP_token)
        this._criarRegistro = new CriarRegistro(process.env.REACT_APP_token)
        this._atualizarRegistro = new AtualizaRegistro(process.env.REACT_APP_token)
    }

 async criarRegistro(tabela,dado){
   const dadoCriado = await this._criarRegistro.criarRegistro(tabela,dado)
   return dadoCriado
 }

 async pegaDadoUnico(tabela,id){
    const dado = await this._pegarRegistroUnico.pegaRegistroUnico(tabela,id)
    return dado
 }

 async pegaDadosLista(tabela){
  const dado = await this._pegarRegistrosTabela.pegarRegistrosTabela(tabela)
  return dado
}

async atualizarRegistro(tabela,dados){
  const dado = await this._atualizarRegistro.atualizaRegistro(tabela,dados)
  return dado
}
}