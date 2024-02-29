import {OrdensController} from "./OrdensController.js";

const controller = new OrdensController()


const objTeste = {
    ordem_producao:'010102'
}

const teste = await controller.criarRegistro('fk0lbipncnh3mu7u95dls',objTeste)

console.log(teste)