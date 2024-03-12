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
import Input from "../Input/Input.js";
import mesas from "../../BD/mesas.js";
import turnos from "../../BD/turnos.js";
import Label from "../Label/Label.js";
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
    const [ModalEdicao, setModalEdicao] = useState(false)
    const [OrdemEditando, setOrdemEditando] = useState({})
    const [NumeroOP, setNumeroOP] = useState('')
    const [Matricula, setMatricula] = useState('')
    const [Mesa, setMesa] = useState('')
    const [Turno, setTurno] = useState('')
    const [QuantidadeProduzida, setQuantidadeProduzida] = useState(0)
    const [ModalQuantidadeFinalizacao, setModalQuantidadeFinalizacao] = useState(false)
    const [OrdemFinalizar, setOrdemFinalizar] = useState({})

    //HandlePausa, ordem é definido no botão da lista ao colocar de 'Pausado' para 'Em Andamento', mas quando de 'Em Andamento' para 'Pausado' ele abre primeiro o modal e então ao enviar o modal ele roda handlePausa com ordem passada na function do modal !
    function HandlePausa(ordem){
    try{
        if(ordem.status === 'Em Andamento' ){
         //HandleModalPausa(ordem)
         if(MotivoPausa !== ''){
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
            
         }else {
            window.alert('Por favor preencha um motivo para a pausa !!')
         }
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

        }
    }catch (error) {
        console.error('Erro ao atualizar o estado das ordens:', error);
    }
    }

    async function HandleFinalizar(ordem){
        if(QuantidadeProduzida > 0){
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
                    ordemAtual['quantidade_produzida'] = QuantidadeProduzida
                    ordemAtual['horario_termino'] = tranformarDataEmString(horarioFinalizacao)
                    await ordensController.criarRegistro('fk0lbipncnh3mu7u95dls', ordemAtual)
                    ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                    ordensLocalStorage.splice(ordemAtualIndex, 1);
                    localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                    await Delay(1000)
                    setLocalStorage(ordensLocalStorage)
                    setModalQuantidadeFinalizacao(false)
                    setQuantidadeProduzida(0)
                }else {
                    throw new Error('Ordem não encontrada na localStorage.');
                }
            }else{
                window.alert("Coloque a ordem em andamento antes de finalizar")
            }
        }else{
            window.alert('Favor informar a quantidade produzida !!')
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

    function HandleModalEdicao(ordem){
        if(ModalEdicao === false){
            setModalEdicao(true)
            setNumeroOP(ordem.ordem_producao)
            setMatricula(ordem.matricula)
            setMesa(ordem.mesa)
            setTurno(ordem.turno)
            setOrdemEditando(ordem)
        }
        if(ModalEdicao === true){
            setModalEdicao(false)
        }
        }

        
        const HandleNumeroOP = (event) => {
            setNumeroOP(event.target.value);
        };
        const HandleMatricula = (event) => {
            setMatricula(event.target.value);
        };
        
        const HandleMesa = (event) => {
            setMesa(event.target.value);
        };
        
        const HandleTurno = (event) => {
            setTurno(event.target.value);
        };
        
        function EditaComponente(ordemEditando, ordens){
            const confirmacao = window.confirm(`Tem certeza que deseja editar o item ?`)
            if(confirmacao){
                const confereRepetido = ordens.find(ordem => ordem.ordem_producao === NumeroOP)
                const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
                const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordemEditando.id);
                if (ordemAtualIndex !== -1) {
                    const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                    if(ordemAtual['ordem_producao'] !== NumeroOP && confereRepetido){
                        window.alert("Ordem de produção ja esta na lista !!")
                    }else{
                     if(NumeroOP.trim().length > 0 && Matricula.trim().length > 0  && Mesa.trim().length > 0  && Turno.trim().length > 0){
                        ordemAtual['ordem_producao'] = NumeroOP
                        ordemAtual['matricula'] = Matricula
                        ordemAtual['mesa'] = Mesa
                        ordemAtual['turno'] = Turno
                        ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                        localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                        setLocalStorage(ordensLocalStorage)
                        setModalEdicao(false)
                    }else{
                        window.alert('Não pode haver campos vazios !!')
                    }
                    }
                    }
            }
            }

            const HandleQuantidadeProduzida = (event) => {
                setQuantidadeProduzida(event.target.value);
            };

            function HandleModalQuantidadeFinalizacao(ordem){
                if(ModalQuantidadeFinalizacao === false){
                    setModalQuantidadeFinalizacao(true)
                    setOrdemFinalizar(ordem)
                }
                if(ModalQuantidadeFinalizacao === true){
                    setModalPausa(false)
                }
                }

        
    return(
        <ContainerOrdens>
            
            <OrdensUl>
                {
                    ordens.map(ordem =>  (
                        <OrdensLi backgroundcolor={ordem.status === 'Em Andamento' ? '#24ab92' : '#bf6b47'} key={ordem.id}>
                            
                            <ItemLista>
                                <Titulo4 font_size='16px'>ORDEM PRODUÇÃO:</Titulo4>
                                <SpanOrdem>{ordem.ordem_producao}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='16px'>FUNCIONARIO:</Titulo4>
                                <SpanOrdem>{ordem.matricula}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='16px'>MESA DE MONTAGEM:</Titulo4>
                                <SpanOrdem>{ordem.mesa}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='16px'>STATUS:</Titulo4>
                                <SpanOrdem>{ordem.status}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='16px'>TURNO:</Titulo4>
                                <SpanOrdem>{ordem.turno}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 font_size='16px'>MOTIVO DA PAUSA:</Titulo4>
                                <SpanOrdem>{ordem.status === "Pausado" ? pegaUltimoMotivoPausa(ordem.motivos_das_pausas) : ''}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' font_size='20px' backgroundcolor={ordem.status === 'Em Andamento' ? '#DAA520' : '#00FA9A'} onClick={async() => {ordem.status === 'Em Andamento' ? HandleModalPausa(ordem) : HandlePausa(ordem)}} width='80%'>{ordem.status === 'Em Andamento' ? 'PAUSAR' : 'RETORNAR'}</Botao>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.1px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' backgroundcolor='#FF6347' color='black' font_size='20px' width='80%' onClick={async() => await HandleModalQuantidadeFinalizacao(ordem)}>FINALIZAR</Botao>
                            </ItemLista>
                                <Botao   padding='2px 2px'  backgroundcolor='rgb(0,0,0,0)' color='black' font_size='20px' width='10%' onClick={async() => HandleModalEdicao(ordem)}><Imagem src={ImagemEditar} width='60%'></Imagem></Botao>
                                
                                
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
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => HandlePausa(OrdemPausada)}>ENVIAR</Botao>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() => setModalPausa(false)}>CANCELAR</Botao>
    </Modal>
    
    
    <Modal 
    isOpen={ModalEdicao}
    onRequestClose={async() => setModalEdicao(false)}
    contentLabel="Edição"
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
        <Label font_size = '26px'>Numero da Ordem de produção :</Label>
        <Input placeholder="Numero da OP"   padding = "20px 0px" width="60%" margin ="1rem 0px" border_radius="20px" border='0.1px black solid' font_size="20px" value={NumeroOP} onChange={HandleNumeroOP} ></Input>
        <Label font_size = '26px'>Matricula do funcionario :</Label>
        <Input placeholder="Matricula Funcionario"  padding = "20px 0px" width="30%" margin ="1rem 0px" border_radius="20px" border='0.1px black solid' font_size="20px" value={Matricula} onChange={HandleMatricula} ></Input>
        <Label font_size = '26px'>Mesa :</Label>
             <Select margin='1rem 0' width='30%'  padding='10px' value={Mesa} border='0.1px black solid' onChange={HandleMesa}>
                 <Option padding='10px 2px' fontSize='20px' value='' >Selecione Uma Mesa...</Option>
                {
                    mesas.map((mesa,index) => (
                        <Option key={index} padding='10px 2px' fontSize='20px' >{mesa}</Option>
                    ))
                }
                </Select>
                <Label font_size = '26px'>Turno :</Label>
                <Select margin='1rem 0' width='30%'  padding='10px' border='0.1px black solid' value={Turno} onChange={HandleTurno}>
                <Option padding='10px 2px' fontSize='20px' value='' >Selecione Um Turno...</Option>
                {
                    turnos.map((turno,index) =>(
                        <Option key={index} padding='10px 2px' fontSize='20px' >{turno}</Option>
                    ))
                }
                    
                    </Select>  
    
      <Botao padding='20px 10px' width='40%' margin='1rem 10px' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => EditaComponente(OrdemEditando, ordens)}>ATUALIZAR</Botao>
      <Botao padding='20px 10px' width='40%' margin='1rem 10px' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() => setModalEdicao(false)}>CANCELAR</Botao>
  
    </Modal>
    
    <Modal 
    isOpen={ModalQuantidadeFinalizacao}
    onRequestClose={async() => setModalQuantidadeFinalizacao(false)}
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
      <Label>Quantas peças foram produzidas ?</Label>
      <Input placeholder="Quantidade Produzida"   padding = "20px 0px" width="40%" margin ="1rem 0px" border_radius="20px" border='0.1px black solid' font_size="20px" value={QuantidadeProduzida} onChange={HandleQuantidadeProduzida}></Input>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => HandleFinalizar(OrdemFinalizar)}>FINALIZAR</Botao>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() => setModalQuantidadeFinalizacao(false)}>CANCELAR</Botao>
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