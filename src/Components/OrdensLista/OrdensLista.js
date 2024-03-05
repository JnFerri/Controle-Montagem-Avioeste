import styled from "styled-components";
import Titulo4 from "../Titulo4/Titulo4.js";
import Botao from "../Botao/Botao.js";
import { OrdensController } from "../../Controller/OrdensController.js";
import tranformarDataEmString from "../../Helpers/tranformarDataEmString.js";
import { PegarOrdensNaoFinalizadas } from "../../Services/PegarOrdensNaoFinalizadas.js";
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


`
const ItemLista = styled.div`
width:25%;
padding: 5px 5px;
display:flex;
flex-direction:column;
align-items:center; 
`


function OrdensLista({ordens, setOrdens}){
    
    async function HandlePausa(ordem){
    try{
        if(ordem.status === 'Em Andamento' ){
            const horarioPausa = new Date()
            const dataPausaJestor = tranformarDataEmString(horarioPausa)
            const motivoPausa = window.prompt('Qual o motivo da pausa ?')
            const obj = {}
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
            await setOrdens(ordensNaoFinalizadas)
            
        }
        if(ordem.status === 'Pausado'){
            const dataRecomeco = new Date()
            const dataRecomecoString = tranformarDataEmString(dataRecomeco)
            const dataPausa = new Date(ordem.horario_pausa)
            const diferencaHorariosMiliSegundos = dataRecomeco - dataPausa 
            const obj = {}
            obj['horario_recomeco'] = dataRecomecoString
            obj['qnt_pausado'] = ordem.qnt_pausado + diferencaHorariosMiliSegundos
            obj['id_fk0lbipncnh3mu7u95dls'] = ordem.id_fk0lbipncnh3mu7u95dls
            obj['status'] = 'Em Andamento'
            await ordensController.atualizarRegistro('fk0lbipncnh3mu7u95dls', obj)
            await Delay(1000)
            const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
            await setOrdens(ordensNaoFinalizadas)

        }
    }catch (error) {
        console.error('Erro ao atualizar o estado das ordens:', error);
    }
    }

    async function HandleFinalizar(ordem){
        const horarioFinalizacao = new Date()
        const horarioInicio = new Date(ordem.horario_inicio)
        const tempoTotalMilisegundos = horarioFinalizacao - horarioInicio
        const obj = {}
            if(ordem.status === 'Em Andamento'){
            obj['tempo_em_producao'] = tempoTotalMilisegundos - ordem.qnt_pausado
            obj['tempo_total_producao'] = tempoTotalMilisegundos
            obj['id_fk0lbipncnh3mu7u95dls'] = ordem.id_fk0lbipncnh3mu7u95dls
            obj['status'] = 'Finalizado'
            obj['finalizado'] = true
            obj['horario_termino'] = tranformarDataEmString(horarioFinalizacao)
            await ordensController.atualizarRegistro('fk0lbipncnh3mu7u95dls', obj)
            await Delay(1000)
            const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
            await setOrdens(ordensNaoFinalizadas)
            }else{
                window.alert("Coloque a ordem Em andamento antes de finalizar")
            }
    }
            
        
    return(
        <ContainerOrdens>
            
            <OrdensUl>
                {
                    ordens.map(ordem =>  (
                        <OrdensLi key={ordem.id_fk0lbipncnh3mu7u95dls}>
                            
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
                                <Botao border='0.1px black solid' padding='10px 5px' borderRadius='5px' fontSize='20px' backgroundcolor={ordem.status === 'Em Andamento' ? '#DAA520' : '#00FA9A'} onClick={async() => await HandlePausa(ordem)} width='50%'>{ordem.status === 'Em Andamento' ? 'Pausar' : 'Retornar'}</Botao>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' padding='10px 5px' borderRadius='5px' backgroundcolor='#FF6347' color='black' fontSize='20px' width='50%' onClick={async() => await HandleFinalizar(ordem)}>Finalizar</Botao>
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