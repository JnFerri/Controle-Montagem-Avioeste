import styled from "styled-components";
import Titulo4 from "../Titulo4/Titulo4.js";
import Botao from "../Botao/Botao.js";
import { OrdensController } from "../../Controller/OrdensController.js";
import tranformarDataEmString from "../../Helpers/tranformarDataEmString.js";
//import { PegarOrdensNaoFinalizadas } from "../../Services/PegarOrdensNaoFinalizadas.js";
import Delay from "../../Helpers/Delay.js";
const ordensController = new OrdensController()

const ContainerOrdens = styled.section`
    width:90%;
    background-color:white;
    border-radius:30px;
    display: flex;
    flex-direction:column;
    align-items:center;
`
const OrdensUl = styled.ul`
    display:flex;
    align-items:center;
    justify-content:center;
    width: 95%;
    flex-direction:column;
    padding-inline-start: 0px;
    text-align:center;

`
const OrdensLi = styled.li`
    width: 100%;
    display:flex;
    align-items:center;
    padding:10px 0px;
    border:solid 0.5px black;
    border-radius:15px;
    margin:4px 0px;
    background-color: ${props => props.backgroundcolor || 'white'};


`
const ItemLista = styled.div`
width:25%;
padding: 5px 5px;
display:flex;
flex-direction:column;
align-items:center; 
`


function OrdensLista({ordens, setOrdens, setLocalStorage}){
    
    async function HandlePausa(ordem){
    try{
        if(ordem.status === 'Em Andamento' ){
            const horarioPausa = new Date()
            const dataPausaJestor = tranformarDataEmString(horarioPausa)
            const motivoPausa = window.prompt('Qual o motivo da pausa ?')
            const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
            const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);

            if (ordemAtualIndex !== -1) {
                const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                ordemAtual['horario_pausa'] = dataPausaJestor;
                ordemAtual['status'] = 'Pausado';
                ordemAtual['motivos_das_pausas'] = ordemAtual['motivos_das_pausas'] ? `${ordem.motivos_das_pausas} , ${motivoPausa}` : `${motivoPausa}`;
                ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                setLocalStorage(ordensLocalStorage)
            }else {
                throw new Error('Ordem não encontrada na localStorage.');
            }
            /*const obj = {}
            obj['horario_pausa'] = dataPausaJestor
            obj['id_fk0lbipncnh3mu7u95dls'] = ordem.id_fk0lbipncnh3mu7u95dls
            obj['status'] = 'Pausado' 
            console.log(ordem.motivos_das_pausas)
            if(ordem.motivos_das_pausas !== null && ordem.motivos_das_pausas !== ''){
                obj['motivos_das_pausas'] = `${ordem.motivos_das_pausas} , ${motivoPausa}` 
            }else{
                obj['motivos_das_pausas'] = `${motivoPausa}` 
            }
            await  ordensController.atualizarRegistro('fk0lbipncnh3mu7u95dls', obj)
            await Delay(1000)
            const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
            await setOrdens(ordens)*/
            
        }
        if(ordem.status === 'Pausado'){
            
            const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
            const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);

            if (ordemAtualIndex !== -1) {
                const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                const dataRecomeco = new Date()
                const dataRecomecoString = tranformarDataEmString(dataRecomeco)
                const horarioPausa = `${ordemAtual['horario_pausa']}`
                const dateMiliseconds = Date.parse(horarioPausa)
                const dataPausa = new Date(dateMiliseconds + 10800000)
                const diferencaHorariosMiliSegundos = dataRecomeco - dataPausa
                ordemAtual['horario_recomeco'] = dataRecomecoString
                ordemAtual['status'] = 'Em Andamento'
                if(ordem['qnt_pausado']){
                    ordemAtual['qnt_pausado'] = ordemAtual['qnt_pausado'] + diferencaHorariosMiliSegundos
                }else{
                    ordemAtual['qnt_pausado'] = diferencaHorariosMiliSegundos
                }
                ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                setLocalStorage(ordensLocalStorage)
            }else {
                throw new Error('Ordem não encontrada na localStorage.');
            }
            /*const obj = {}
            obj['horario_recomeco'] = dataRecomecoString
            obj['qnt_pausado'] = ordem.qnt_pausado + diferencaHorariosMiliSegundos
            obj['id_fk0lbipncnh3mu7u95dls'] = ordem.id_fk0lbipncnh3mu7u95dls
            obj['status'] = 'Em Andamento'
            await ordensController.atualizarRegistro('fk0lbipncnh3mu7u95dls', obj)
            await Delay(1000)
            const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
            await setOrdens(ordens)*/

        }
    }catch (error) {
        console.error('Erro ao atualizar o estado das ordens:', error);
    }
    }

    async function HandleFinalizar(ordem){
        const horarioFinalizacao = new Date()
        const horarioInicio = new Date(Date.parse(ordem.horario_inicio) + 10800000)
        const tempoTotalMilisegundos = horarioFinalizacao - horarioInicio
        const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
        const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
        if(ordem.status === 'Em Andamento'){
            if (ordemAtualIndex !== -1) {
                const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                ordemAtual['tempo_em_producao'] = tempoTotalMilisegundos - ordem.qnt_pausado
                ordemAtual['tempo_total_producao'] = tempoTotalMilisegundos
                ordemAtual['finalizado'] = true
                ordemAtual['status'] = 'Finalizado'
                ordemAtual['horario_termino'] = tranformarDataEmString(horarioFinalizacao)
                await ordensController.criarRegistro('fk0lbipncnh3mu7u95dls', ordemAtual)
                ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                ordensLocalStorage.splice(ordemAtualIndex, 1);
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                await Delay(1000)
                setLocalStorage(ordensLocalStorage)
            }else {
                throw new Error('Ordem não encontrada na localStorage.');
            }
        }else{
            window.alert("Coloque a ordem Em andamento antes de finalizar")
        }


        /*const obj = {}
            if(ordem.status === 'Em Andamento'){
            obj['tempo_em_producao'] = tempoTotalMilisegundos - ordem.qnt_pausado
            obj['tempo_total_producao'] = tempoTotalMilisegundos
            obj['id_fk0lbipncnh3mu7u95dls'] = ordem.id_fk0lbipncnh3mu7u95dls
            obj['status'] = 'Finalizado'
            obj['finalizado'] = true
            obj['horario_termino'] = tranformarDataEmString(horarioFinalizacao)
            //await ordensController.atualizarRegistro('fk0lbipncnh3mu7u95dls', obj)
            await ordensController.criarRegistro('fk0lbipncnh3mu7u95dls', obj)
            
            await Delay(1000)
            //const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
            await setOrdens()
            }else{
                window.alert("Coloque a ordem Em andamento antes de finalizar")
            }*/
    }

    function pegaUltimoMotivoPausa(motivos){
        if(motivos){
            const motivosArray = motivos.split(',')
            const ultimoMotivo = motivosArray[motivosArray.length - 1]
            return ultimoMotivo
        }
    }
            
        
    return(
        <ContainerOrdens>
            
            <OrdensUl>
                {
                    ordens.map(ordem =>  (
                        <OrdensLi backgroundcolor={ordem.status === 'Em Andamento' ? '#24ab92' : '#bf6b47'} key={ordem.id}>
                            
                            <ItemLista>
                                <Titulo4>Ordem Produção:</Titulo4>
                                <span>{ordem.ordem_producao}</span>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4>Matricula Operador:</Titulo4>
                                <span>{ordem.matricula}</span>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4>Mesa de Montagem:</Titulo4>
                                <span>{ordem.mesa_teste}</span>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4>Status:</Titulo4>
                                <span>{ordem.status}</span>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4>Motivo da Pausa:</Titulo4>
                                <span>{ordem.status === "Pausado" ? pegaUltimoMotivoPausa(ordem.motivos_das_pausas) : ''}</span>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' borderRadius='5px' fontSize='20px' backgroundcolor={ordem.status === 'Em Andamento' ? '#DAA520' : '#00FA9A'} onClick={async() => await HandlePausa(ordem)} width='50%'>{ordem.status === 'Em Andamento' ? 'Pausar' : 'Retornar'}</Botao>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' borderRadius='5px' backgroundcolor='#FF6347' color='black' fontSize='20px' width='50%' onClick={async() => await HandleFinalizar(ordem)}>Finalizar</Botao>
                            </ItemLista>
                        </OrdensLi>
                    )

                    )
                }
            </OrdensUl>
        </ContainerOrdens>
    )
}

export default OrdensLista