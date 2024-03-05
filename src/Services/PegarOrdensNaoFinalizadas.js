import { OrdensController } from "../Controller/OrdensController.js"
const ordensController = new OrdensController()
export async function PegarOrdensNaoFinalizadas(tabela){
    const ordens = await ordensController.pegaDadosLista(tabela)
        const ordensNaoFinalizadas =await ordens.filter(ordem => ordem.finalizado === false)
        return ordensNaoFinalizadas
}