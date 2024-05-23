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
import { useCallback, useEffect, useState } from "react";
import Imagem from "../Imagem/Imagem.js";
import ImagemEditar from "../../images/caneta.png"
import Input from "../Input/Input.js";
import mesas from "../../BD/mesas.js";
import turnos from "../../BD/turnos.js";
import Label from "../Label/Label.js";
import loadingImg from "../../images/tube-spinner.svg"
import imgAdicionarFuncionario from '../../images/adicionar-usuario.png'
import imgRemoverFuncionario from '../../images/remover-usuario.png'
import motivosRetrabalho from "../../BD/motivosRetrabalho.js";

const ordensController = new OrdensController()

/**
 * Componente section para servir de container dos outros componentes.
 */
const ContainerOrdens = styled.section`
    width:90%;
    background-color:white;
    border-radius:30px;
    display: flex;
    flex-direction:column;
    align-items:center;
`

/**
 * Componente de Lista.
 */
const OrdensUl = styled.ul`
    display:flex;
    align-items:center;
    justify-content:center;
    width: 95%;
    flex-direction:column;
    padding-inline-start: 0px;
    text-align:center;

`

/**
 * Componente linha da lista.
 */
const OrdensLi = styled.li`
    width: 100%;
    display:flex;
    align-items:center;
    padding:20px 10px;
    border:solid 0.5px black;
    border-radius:15px;
    margin:4px 4px;
    background-color: ${props => props.backgroundcolor || 'white'};


`
/**
 * Componente utilizado para englobar informações das ordens.
 */
const ItemLista = styled.div`
width:25%;
padding: 5px 5px;
display:flex;
flex-direction:column;
align-items:center; 
`

/**
 * Componente onde o dado referente a ordem é escrito.
 */
const SpanOrdem = styled.span`
    font-size : 18px;
    color: white;
    background-color:black;
    width:100%;
    border-radius: 0px 0px 5px 5px;
    margin:0px 3px;


`

/**
 * Componente div para englobar componentes em linha alinhados na horizontal.
 */
const DivLinha = styled.div`
    display:flex;
    align-items:center;
    width:100%;
    justify-content:center;

`
/**
 * Componente div para englobar componentes em coluna alinhados na vertical.
 */
const DivColuna = styled.div`
    display:flex;
    align-items:center;
    flex-direction:column;
    margin:0px 5px;
    text-align:center;
`
function OrdensLista({ordens, setOrdens, setLocalStorage}){
    
    const [ModalPausa, setModalPausa] = useState(false)
    const [MotivoPausa, setMotivoPausa] = useState('')
    const [OrdemPausada, setOrdemPausada] = useState({})
    const [ModalEdicao, setModalEdicao] = useState(false)
    const [OrdemEditando, setOrdemEditando] = useState({})
    const [NumeroOP, setNumeroOP] = useState('')
    const [MatriculasNovas, setMatriculasNovas] = useState([])
    const [Mesa, setMesa] = useState('')
    const [Turno, setTurno] = useState('')
    const [QuantidadeProduzida, setQuantidadeProduzida] = useState(0)
    const [ModalQuantidadeFinalizacao, setModalQuantidadeFinalizacao] = useState(false)
    const [OrdemFinalizar, setOrdemFinalizar] = useState({})
    const [LoadingFinalizacao, setLoadingFinalizacao] = useState(false)
    const [QuantidadeFuncionarios, setQuantidadeFuncionarios] = useState('')
    const [InputMatriculas, setInputMatriculas] = useState([])
    const [MotivoRetrabalho, setMotivoRetrabalho] = useState('')

    //HandlePausa, ordem é definido no botão da lista ao colocar de 'Pausado' para 'Em Andamento', mas quando de 'Em Andamento' para 'Pausado' ele abre primeiro o modal e então ao enviar o modal ele roda handlePausa com ordem passada na function do modal !
    function HandlePausa(ordem){
    try{
        if(ordem.status === 'Em Andamento' ){
        //HandleModalPausa(ordem)
         if(MotivoPausa !== ''){
            if(MotivoPausa === 'Retrabalho' && MotivoRetrabalho === ''){
                window.alert('Por favor preencha um motivo para o retrabalho !!')
            }else {
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
   
                    const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || [];
                    const pausasLocalStorageIndex = pausasLocalStorage.findIndex(element => element.id === ordem.id)
                    
                    if (pausasLocalStorageIndex !== -1){
                        const obj = {ordem_producao:ordensLocalStorage[ordemAtualIndex]['ordem_producao'],motivo_pausa:MotivoPausa, motivo_retrabalho : MotivoRetrabalho }
                        pausasLocalStorage[pausasLocalStorageIndex].pausas.push(obj)
                        localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                    }else{
                       const obj = {id:ordem.id, pausas: [{ ordem_producao:ordensLocalStorage[ordemAtualIndex]['ordem_producao'],motivo_pausa:MotivoPausa, motivo_retrabalho : MotivoRetrabalho }] }
                       pausasLocalStorage.push(obj)
                       localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                    }
                    setMotivoPausa('')
                    setMotivoRetrabalho('')
   
                }else {
                    throw new Error('Ordem não encontrada na localStorage.');
                }


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
                
                const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || [];
                const pausasLocalStorageIndex = pausasLocalStorage.findIndex(element => element.id === ordem.id)
                if (pausasLocalStorageIndex !== -1){
                    const ultimoIndice = pausasLocalStorage[pausasLocalStorageIndex].pausas.length - 1
                    pausasLocalStorage[pausasLocalStorageIndex].pausas[ultimoIndice]['tempo_pausado'] = diferencaHorariosMiliSegundos
                    localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                }
                
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
            const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
            const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || [];
            const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
            const pausasAtualIndex = pausasLocalStorage.findIndex(element => element.id === ordem.id);
            if(ordem.status === 'Em Andamento'){
                if (ordemAtualIndex !== -1) {
                    setLoadingFinalizacao(true)
                    const tempoTotalMilisegundos = horarioFinalizacao - horarioInicio
                    const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                    if(ordem.qnt_pausado > 0){
                        ordemAtual['tempo_em_producao'] = tempoTotalMilisegundos - ordem.qnt_pausado
                    }else{
                        ordemAtual['tempo_em_producao'] = tempoTotalMilisegundos
                    }
                    ordemAtual['tempo_total_producao'] = tempoTotalMilisegundos
                    ordemAtual['finalizado'] = true
                    ordemAtual['status'] = 'Finalizado'
                    ordemAtual['quantidade_produzida'] = QuantidadeProduzida
                    ordemAtual['horario_termino'] = tranformarDataEmString(horarioFinalizacao)
                    const result = await ordensController.criarRegistro(process.env.REACT_APP_TABELA, ordemAtual)
                    console.log(result)
                    if(result.error){
                        window.alert(result.error)
                        const ordemAtualIndexOrdens = ordens.findIndex(element => element.id === ordem.id)
                        ordens.splice(ordemAtualIndexOrdens, 1);
                        ordensLocalStorage.splice(ordemAtualIndex, 1);
                        localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                        setModalQuantidadeFinalizacao(false)
                        setQuantidadeProduzida(0)
                        setLoadingFinalizacao(false)
                    }else {
                        ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                        ordensLocalStorage.splice(ordemAtualIndex, 1);
                        localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                        await Delay(1000)
                        setLocalStorage(ordensLocalStorage)
    
                        if(pausasLocalStorage.length > 0){

                            if(pausasLocalStorage[pausasAtualIndex].pausas.length > 0){
                                pausasLocalStorage[pausasAtualIndex].pausas.forEach( async (pausa) => {
                                    const obj = {
                                        conexao_apontamentos_2:result.data[`id_${process.env.REACT_APP_TABELA}`],
                                        ordem_producao:pausa.ordem_producao,
                                        motivo_pausa:pausa.motivo_pausa,
                                        tempo_pausado:pausa.tempo_pausado,
                                        motivo_retrabalho: pausa.motivo_retrabalho
                                    }
                                    await ordensController.criarRegistro('o3f0tbvxjnxj_k4odqh_0', obj)
                                    
                                })
                                pausasLocalStorage.splice(pausasAtualIndex, 1)
                                localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                            }
                        }
                        
                        
    
                        setModalQuantidadeFinalizacao(false)
                        setQuantidadeProduzida(0)
                        setLoadingFinalizacao(false)
                        
                    }
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
            setMatriculasNovas(ordem.matriculas)
            setMesa(ordem.mesa)
            setTurno(ordem.turno)
            setQuantidadeFuncionarios(ordem.quantidade_funcionarios)
            setOrdemEditando(ordem)
        }
        if(ModalEdicao === true){
            setModalEdicao(false)
        }
        }

        
        const HandleNumeroOP = (event) => {
            setNumeroOP(event.target.value);
        };
        const HandleMatricula = useCallback((index, event) => {
            const newMatriculas = [...MatriculasNovas];
            newMatriculas[index] = event.target.value;
            setMatriculasNovas(newMatriculas);
      }, [MatriculasNovas]);
        
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
                     if(NumeroOP.trim().length > 0 && MatriculasNovas.length > 0  && Mesa.trim().length > 0  && Turno.trim().length > 0){
                        ordemAtual['ordem_producao'] = NumeroOP
                        ordemAtual['matriculas'] = MatriculasNovas
                        ordemAtual['matricula'] = MatriculasNovas[0]
                        ordemAtual['matricula_2'] = MatriculasNovas[1]
                        ordemAtual['matricula_3'] = MatriculasNovas[2]
                        ordemAtual['matricula_4'] = MatriculasNovas[3]
                        ordemAtual['mesa'] = Mesa
                        ordemAtual['turno'] = Turno
                        ordemAtual['quantidade_funcionarios'] = QuantidadeFuncionarios
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


                const AdicaoFuncionario = () => {
                    if(QuantidadeFuncionarios < 4){
                    setQuantidadeFuncionarios(QuantidadeFuncionarios + 1)
                    }else{
                        window.alert('Maximo 4 Funcionarios por Ordem de Produção !!')
                    }
                }
            
                const RemoverFuncionario = () => {
                    const novoValor = [...MatriculasNovas]
                    setQuantidadeFuncionarios(QuantidadeFuncionarios-1)
                    novoValor.splice(-1,1)
                    setMatriculasNovas(novoValor)
                }

                useEffect(() => {
        
                    const inputs = []
                    for(let i = 0;i < QuantidadeFuncionarios; i++){
                        inputs.push(
                            <Input
                              key={i}
                              placeholder="Matrícula do Funcionário"
                              style={{ border: '2px solid black', padding: '20px 0px', width: '50%', margin: '1rem 3px', borderRadius: '20px', fontSize: '20px' }}
                              value={MatriculasNovas[i] || ''}
                              required
                              onChange={(e) => HandleMatricula(i, e)}
                            />
                          );
                    }
                    setInputMatriculas(inputs)
                },[QuantidadeFuncionarios, HandleMatricula, MatriculasNovas])
            
            const HandleMotivoRetrabalho = (e) => {
                setMotivoRetrabalho(e.target.value)
            }

            const ExcluirOrdem = (ordem) => {
                const confirmação  = window.confirm('Tem certeza que deseja excluir esta Ordem de Produção ?')
                if(confirmação){
                    const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
                    var ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
                    console.log(ordemAtualIndex)
                    if(!ordemAtualIndex){
                    ordemAtualIndex = ordensLocalStorage.findIndex(element => element.ordem_producao === ordem.ordem_producao)
                    }
                    ordensLocalStorage.splice(ordemAtualIndex, 1)
                    localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                    setLocalStorage(ordensLocalStorage)
                }
            }
        
    return(
        <ContainerOrdens>
            
            <OrdensUl>
                {
                    ordens.map((ordem, index) =>  (
                        <OrdensLi backgroundcolor={ordem.status === 'Em Andamento' ? '#24ab92' : '#bf6b47'} key={index}>
                            
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>ORDEM PRODUÇÃO:</Titulo4>
                                <SpanOrdem>{ordem.ordem_producao}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>FUNCIONARIOS:</Titulo4>
                                 
                                <DivLinha>
                                {  
                                    ordem.matriculas.map((matricula,index) => (
                                        <SpanOrdem key={index}>{matricula}</SpanOrdem>
                                    ))
                                }
                                </DivLinha>
                               
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>MESA:</Titulo4>
                                <SpanOrdem>{ordem.mesa}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>STATUS:</Titulo4>
                                <SpanOrdem>{ordem.status}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>TURNO:</Titulo4>
                                <SpanOrdem>{ordem.turno}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>MOTIVO DA PAUSA:</Titulo4>
                                <SpanOrdem>{ordem.status === "Pausado" ? pegaUltimoMotivoPausa(ordem.motivos_das_pausas) : ''}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.3px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' font_size='20px' backgroundcolor={ordem.status === 'Em Andamento' ? '#DAA520' : '#00FA9A'} onClick={async() => {ordem.status === 'Em Andamento' ? HandleModalPausa(ordem) : HandlePausa(ordem)}} width='80%'>{ordem.status === 'Em Andamento' ? 'PAUSAR' : 'RETORNAR'}</Botao>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.3px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' backgroundcolor='#FF6347' color='black' font_size='20px' width='80%' onClick={async() => await HandleModalQuantidadeFinalizacao(ordem)}>FINALIZAR</Botao>
                            </ItemLista>
                                <Botao   padding='2px 2px'  backgroundcolor='rgb(0,0,0,0)' color='black' font_size='20px' width='10%' onClick={() => HandleModalEdicao(ordem)}><Imagem src={ImagemEditar} width='60%'></Imagem></Botao>
                                
                                
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
      {
        MotivoPausa === 'Retrabalho' ? 
        <Select onChange={HandleMotivoRetrabalho} margin='30px 0px' padding='20px 0px' width='80%' font_size='24px'>
      <Option width='80%' padding='20px 0px' font_size='24px' value=''>Selecione um Motivo do Retrabalho...</Option>
        {
            motivosRetrabalho.map((motivos,index) => (
                <Option width='80%' padding='20px 0px' font_size='24px' key={index}>{motivos}</Option>
            ))
        }
      </Select>
      :
      ''
      }
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
        <DivLinha>
            {  
                  InputMatriculas
            }
            
            <DivColuna style={{cursor:'pointer' , width:'10%'}} onClick={AdicaoFuncionario}>
             <Imagem src={imgAdicionarFuncionario} width='30%'/>
             <span style={{color:'black'}}>Adicionar Funcionario</span>
            </DivColuna>
            { QuantidadeFuncionarios > 1 || QuantidadeFuncionarios === '' ? 
            <DivColuna style={{cursor:'pointer' , width:'10%'}} onClick={RemoverFuncionario}>
            <Imagem src={imgRemoverFuncionario} width='30%'/>
            <span style={{color:'black'}}>Remover Funcionario</span>
           </DivColuna>
           : ''    
        }
                </DivLinha>
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
      <Botao padding='20px 10px' width='40%' margin='1rem 10px' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() =>{ setModalEdicao(false)}   }>CANCELAR</Botao>
      <p>Houve algum problema durante o apontamento da ordem de produção ? Caso a ordem de produção tenha sido marcada de forma que não condiz com a realidade favor exclua a ordem de produção para evitar erros nos dados ! </p>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() =>{ ExcluirOrdem(ordem)}   }>EXCLUIR</Botao>         
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
      {LoadingFinalizacao ? 
      <>
      <Imagem src={loadingImg} width='20%'></Imagem> 
      <span>Finalizando...</span>
      </>
      :
      <>
      <Input placeholder="Quantidade Produzida"   padding = "20px 0px" width="40%" margin ="1rem 0px" border_radius="20px" border='0.1px black solid' font_size="20px" value={QuantidadeProduzida} onChange={HandleQuantidadeProduzida}></Input>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => HandleFinalizar(OrdemFinalizar)}>FINALIZAR</Botao>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() => setModalQuantidadeFinalizacao(false)}>CANCELAR</Botao>
      </>
      }
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