import styled from "styled-components";
import Titulo4 from "../Titulo4/Titulo4.js";
import Botao from "../Botao/Botao.js";
import { OrdensController } from "../../Controller/OrdensController.js";
import tranformarDataEmString from "../../Helpers/tranformarDataEmString.js";
//import { PegarOrdensNaoFinalizadas } from "../../Services/PegarOrdensNaoFinalizadas.js";
import Delay from "../../Helpers/Delay.js";
import Modal from 'react-modal';
import Select from "../Select/Select.js";
import Option from "../Select/Option/Option.js";
import motivosPausas from "../../BD/motivosPausas.js";
import Titulo2 from "../Titulo2/Titulo2.js";
import { useState } from "react";
import Imagem from "../Imagem/Imagem.js";
import ImagemEditar from "../../images/caneta.png"
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
const SpanOrdem = styled.span`
    font-size : 18px;
    color:
`

function OrdensLista({ordens, setOrdens, setLocalStorage}){
    
    const [ModalPausa, setModalPausa] = useState(false)
    const [MotivoPausa, setMotivoPausa] = useState('')
    const [OrdemPausada, setOrdemPausada] = useState({})

     function HandlePausa(ordem){
    try{
        if(ordem.status === 'Em Andamento' ){
         //HandleModalPausa(ordem)
         const horarioPausa = new Date()
         const dataPausaJestor = tranformarDataEmString(horarioPausa)
         const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
         const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
         if (ordemAtualIndex !== -1) {
             const ordemAtual = ordensLocalStorage[ordemAtualIndex];
             ordemAtual['horario_pausa'] = dataPausaJestor;
             ordemAtual['motivos_das_pausas'] = ordemAtual['motivos_das_pausas'] ? `${ordem.motivos_das_pausas} , ${MotivoPausa}` : `${MotivoPausa}`;
             ordemAtual['status'] = 'Pausado';
             ordensLocalStorage[ordemAtualIndex] = ordemAtual;
             localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
             setLocalStorage(ordensLocalStorage)
             setModalPausa(false)
         }else {
             throw new Error('Ordem não encontrada na localStorage.');
         }
            
        }
        if(ordem.status === 'Pausado'){
            const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
            const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
            console.log(ordem.id)
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
    }

    function pegaUltimoMotivoPausa(motivos){
        if(motivos){
            const motivosArray = motivos.split(',')
            const ultimoMotivo = motivosArray[motivosArray.length - 1]
            return ultimoMotivo
        }
    }

   function HandleModalPausa(ordem){
    if(ModalPausa === false){
        setModalPausa(true)
        setOrdemPausada(ordem)
    }
    if(ModalPausa === true){
        setModalPausa(false)
        
    }
    }

function HandleMotivo(event){
    setMotivoPausa(event.target.value)
}
        
    return(
        <ContainerOrdens>
            
            <OrdensUl>
                {
                    ordens.map(ordem =>  (
                        <OrdensLi backgroundcolor={ordem.status === 'Em Andamento' ? '#24ab92' : '#bf6b47'} key={ordem.id}>
                            
                            <ItemLista>
                                <Titulo4 font_size='20px'>Ordem Produção:</Titulo4>
                                <SpanOrdem>{ordem.ordem_producao}</SpanOrdem>
                              
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='20px'>Matricula Operador:</Titulo4>
                                <SpanOrdem>{ordem.matricula}</SpanOrdem>
                                
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='20px'>Mesa de Montagem:</Titulo4>
                                <SpanOrdem>{ordem.mesa}</SpanOrdem>
                                
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='20px'>Status:</Titulo4>
                                <SpanOrdem>{ordem.status}</SpanOrdem>
                                
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='20px'>Motivo da Pausa:</Titulo4>
                                <SpanOrdem>{ordem.status === "Pausado" ? pegaUltimoMotivoPausa(ordem.motivos_das_pausas) : ''}</SpanOrdem>
                                
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' font_size='20px' backgroundcolor={ordem.status === 'Em Andamento' ? '#DAA520' : '#00FA9A'} onClick={async() => {ordem.status === 'Em Andamento' ? HandleModalPausa(ordem) : HandlePausa(ordem)}} width='80%'>{ordem.status === 'Em Andamento' ? 'PAUSAR' : 'RETORNAR'}</Botao>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' backgroundcolor='#FF6347' color='black' font_size='20px' width='80%' onClick={async() => await HandleFinalizar(ordem)}>FINALIZAR</Botao>
                            </ItemLista>
                                <Botao   padding='2px 2px'  backgroundcolor='rgb(0,0,0,0)' color='black' font_size='20px' width='10%' onClick={async() => await HandleFinalizar(ordem)}><Imagem src={ImagemEditar} width='40%'></Imagem></Botao>
                            <Modal 
    isOpen={ModalPausa}
    onRequestClose={async() => setModalPausa(false)}
    contentLabel="Motivo da Pausa"
    ariaHideApp={false}
    style={{
        overlay: {
          backgroundColor: 'rgba(0, 0 ,0, 0.8)'
        },
        content: {
          border: '1px solid black',
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          display:'flex',
          flexDirection: "column",
          alignItems:'center'
        }
      }}
    >
      <Titulo2>COLOQUE O MOTIVO DA PAUSA:</Titulo2>
      <Select onChange={HandleMotivo} margin='30px 0px' padding='20px 0px' width='80%' font_size='24px'>
      <Option width='80%' padding='20px 0px' font_size='24px' value=''>Selecione um Motivo...</Option>
        {
            motivosPausas.map((motivos,index) => (
                <Option width='80%' padding='20px 0px' font_size='24px' key={index}>{motivos}</Option>
            ))
        }
      </Select>
      <Botao padding='20px 10px' width='40%' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => HandlePausa(OrdemPausada)}>ENVIAR</Botao>
    </Modal>
                        </OrdensLi>
                        
                    )

                    )
                }
            </OrdensUl>
        </ContainerOrdens>
    )
}

export default OrdensLista