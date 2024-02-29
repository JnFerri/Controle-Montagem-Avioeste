import { AtualizaRegistro } from "../Services/AtualizaRegistro.js"
import { CriarRegistro } from "../Services/CriarRegistro.js"
import { PegaRegistroUnico } from "../Services/PegaRegistroUnico.js"
import { PegarRegistrosTabela } from "../Services/PegaRegistrosTabela.js"
import "../configs/dotenvconfig.js"

export class OrdensController{
    constructor(){
        this._pegarRegistrosTabela = new PegarRegistrosTabela('YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx')
        this._pegarRegistroUnico = new PegaRegistroUnico('YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx')
        this._criarRegistro = new CriarRegistro('YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx')
        this._atualizarRegistro = new AtualizaRegistro('YWRlMTU5YjIxNmY0NzJm19fbd828b4MTY3NjkxMTQ1NjA0ZWEx')
    }

 async criarRegistro(tabela,dado){
   const dadoCriado = await this._criarRegistro.criarRegistro(tabela,dado)
   return dadoCriado
 }

 async pegaDadoUnico(tabela,id){
    const dado = await this._pegarRegistroUnico.pegaRegistroUnico(tabela,id)
    return dado
 }
}