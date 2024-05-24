import Modal from 'react-modal';
import Botao from '../../Botao/Botao.js';
import Option from '../../Select/Option/Option.js';
import Select from '../../Select/Select.js';
import Label from '../../Label/Label.js';
import Imagem from '../../Imagem/Imagem.js';
import styled from 'styled-components';
import Input from '../../Input/Input.js';
import imgAdicionarFuncionario from '../../../images/adicionar-usuario.png'
import imgRemoverFuncionario from '../../../images/remover-usuario.png'
import { useCallback, useEffect, useState } from 'react';
import mesas from "../../../BD/mesas.js";
import turnos from "../../../BD/turnos.js";
import React from 'react';

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

/**
 * Estado que guarda um array dos componentes de input de matriculas com quantidade conforme o valor do estado QuantidadeFuncionariosEdicao.
 * @typedef {EstadoReact} InputMatriculasEdicao
 * @property {Array} InputMatriculasEdicao Array dos componentes de input do formulario de edição.
 * @property {React.Dispatch<React.SetStateAction<Array>>} setInputMatriculasEdicao Função que define novo valor para o estado InputMatriculasEdicao.
 */

/**
 * Estado que guarda o valor do input de numero de ordem de produção do formulario do modal de edição.
 * @typedef {EstadoReact} NumeroOPEdicao
 * @property {string} NumeroOPEdicao Valor do input de ordem de produção do modal de edição.
 * @property {react.Dispatch<React.SetStateAction<string>>} setNumeroOPEdicao Função que define novo valor para o estado NumeroOPEdicao.
 */

/**
 * Estado que guarda um Array das matriculas dos funcionarios adicionadas ao formulario do modal de edição.
 * @typedef {EstadoReact} MatriculasEdicao
 * @property {Array} MatriculasEdicao Array com as matriculas dos funcionarios.
 * @property {React.Dispatch<React.SetStateAction<Array>>} setMatriculasEdicao Função que define novo valor para o estado MatriculasEdicao.
 */

/**
 * Estado que guarda a informação do select de mesa do formulario do modal de edição.
 * @typedef {EstadoReact} MesaEdicao
 * @property {string} MesaEdicao Valor do select de mesa do formulario do modal de edição.
 * @property {React.Dispatch<React.SetStateAction<string>>} setMesaEdicao Função que altera o valor do estado MesaEdicao.
 */

/**
 * Estado que guarda a informação do select de turno no formulario do modal de edição.
 * @typedef {EstadoReact} TurnoEdicao
 * @property {string} TurnoEdicao Valor do select de turno no formulario do modal de edição.
 * @property {React.Dispatch<React.SetStateAction<string>>} setTurnoEdicao Função que define novo valor para o estado TurnoEdicao.
 */

/**
 * Estado que guarda a informação da quantidade de funcionarios conforme quantidade adicionado ao formulario do modal de edição.
 * @typedef {EstadoReact} QuantidadeFuncionariosEdicao
 * @property {number} QuantidadeFuncionariosEdicao Quantidade de funcionarios adicionados ao formulario do modal de edição.
 * @property {React.Dispatch<React.SetStateAction<number>>} setQuantidadeFuncionariosEdicao Função 
 */


/**
 * Componente modal para editar as informações da ordem de produção ou exclui-la.
 * @param {object} props Props do componente.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setModalEdicao Função que define o estado de ModalEdicao.
 * @param {React.Dispatch<React.SetStateAction<Array<Object>>>} props.setLocalStorage Função que define novo valor para o estado LocalStorage.
 * @param {boolean} props.ModalEdicao Estado que define a visualização do modal.
 * @param {Object} props.OrdemEditando Estado que guarda os dados da ordem que esta sendo editada.
 * @param {Array<Object>} props.ordens Estado Ordens que possui os dados das ordens que aparecem na lista. 
 * @returns {JSX.Element} Componente modal com formulario de edição.
 */
function ModalEditar({ setModalEdicao, setLocalStorage, ModalEdicao, OrdemEditando, ordens}){
    /**
     * Estado com Array dos inputs de matricula de funcionario.
     */
    const [InputMatriculasEdicao, setInputMatriculasEdicao] = useState([])
    /**
     * Estado com o valor do input de ordem de produção.
     */
    const [NumeroOPEdicao, setNumeroOPEdicao] = useState('')
    /**
     * Estado com um Array das matriculas colocadas nos inputs do formulario de edição.
     */
    const [MatriculasEdicao, setMatriculasEdicao] = useState([])
    /**
     * Estado com o valor do input de Mesa do formulario de edição.
     */
    const [MesaEdicao, setMesaEdicao] = useState('')
    /**
     * Estado com o valor do input de turno do formulario de edição.
     */
    const [TurnoEdicao, setTurnoEdicao] = useState('')
    /**
     * Estado com o a quantidade de matriculas adicionadas ao formulario.
     */
    const [QuantidadeFuncionariosEdicao, setQuantidadeFuncionariosEdicao] = useState(0)

    /**
     * Ao carregar a pagina define os valores dos inputs e selects com valor inicial igual aos da ordem que esta sendo editada.
     */
    useEffect(() => {
        setNumeroOPEdicao(OrdemEditando.ordem_producao)
        setMatriculasEdicao(OrdemEditando.matriculas)
        setMesaEdicao(OrdemEditando.mesa)
        setTurnoEdicao(OrdemEditando.turno)
        setQuantidadeFuncionariosEdicao(OrdemEditando.quantidade_funcionarios)
    },[OrdemEditando])

    /**
     * Define o valor do estado NumeroOPEdicao com o valor do input de numero de ordem de produção.
     * @param {*} event Evento onchange do input.
     */
    const HandleNumeroOP = (event) => {
        setNumeroOPEdicao(event.target.value);
    };

    /**
     * Define o valor do estado MesaEdição com o valor selecionado no select de Mesa. 
     * @param {*} event Evento onChange do select.
     */
    const HandleMesa = (event) => {
        setMesaEdicao(event.target.value);
    };

    /**
     * Define o valor do estado Turno com o valor selecionado no select de Turno.
     * @param {*} event Evento onChange do select.
     */
    const HandleTurno = (event) => {
        setTurnoEdicao(event.target.value);
    };

    /**
     * Edita os dados da ordem conforme os dados colocados no formulario.
     * @param {Object} ordemEditando Estado OrdemEditando com os dados da ordem que esta sendo editada.
     * @param {Array<Object>} ordens Estado Ordens que contem as ordens que aparecem na lista.
     */
    function EditaComponente(ordemEditando, ordens){
        const confirmacao = window.confirm(`Tem certeza que deseja editar o item ?`)
        if(confirmacao){
            const confereRepetido = ordens.find(ordem => ordem.ordem_producao === NumeroOPEdicao)
            const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
            const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordemEditando.id);
            const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || []
            const pausasAtualIndex = pausasLocalStorage.findIndex(element => element.id === ordemEditando.id)

            
            if (ordemAtualIndex !== -1) {
                const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                if(ordemAtual['ordem_producao'] !== NumeroOPEdicao && confereRepetido){
                    window.alert("Ordem de produção ja esta na lista !!")
                }else{
                    if(NumeroOPEdicao.trim().length > 0 && MatriculasEdicao.length > 0  && MesaEdicao.trim().length > 0  && TurnoEdicao.trim().length > 0){
                        ordemAtual['ordem_producao'] = NumeroOPEdicao
                        ordemAtual['matriculas'] = MatriculasEdicao
                        ordemAtual['matricula'] = MatriculasEdicao[0]
                        ordemAtual['matricula_2'] = MatriculasEdicao[1]
                        ordemAtual['matricula_3'] = MatriculasEdicao[2]
                        ordemAtual['matricula_4'] = MatriculasEdicao[3]
                        ordemAtual['mesa'] = MesaEdicao
                        ordemAtual['turno'] = TurnoEdicao
                        ordemAtual['quantidade_funcionarios'] = QuantidadeFuncionariosEdicao
                        ordensLocalStorage[ordemAtualIndex] = ordemAtual;

                        if(pausasAtualIndex !== -1){
                            const pausas = pausasLocalStorage[pausasAtualIndex].pausas
                            for(let i = 0; i<pausas.length;i++ ){
                                pausas[i].ordem_producao = ordemAtual['ordem_producao']
                            }
                            console.log(pausas)
                            localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                        }


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

        const AdicaoFuncionario = () => {
            if(QuantidadeFuncionariosEdicao < 4){
            setQuantidadeFuncionariosEdicao(QuantidadeFuncionariosEdicao + 1)
            }else{
                window.alert('Maximo 4 Funcionarios por Ordem de Produção !!')
            }
        }

        const RemoverFuncionario = () => {
            const novoValor = [...MatriculasEdicao]
            setQuantidadeFuncionariosEdicao(QuantidadeFuncionariosEdicao -1)
            novoValor.splice(-1,1)
            setMatriculasEdicao(novoValor)
        }
        
        const HandleMatricula = useCallback((index, event) => {
            const newMatriculas = [...MatriculasEdicao];
            newMatriculas[index] = event.target.value;
            setMatriculasEdicao(newMatriculas);
      }, [MatriculasEdicao, setMatriculasEdicao]);

        useEffect(() => {
        
            const inputs = []
            for(let i = 0;i < QuantidadeFuncionariosEdicao; i++){
                inputs.push(
                    <Input
                      key={i}
                      placeholder="Matrícula do Funcionário"
                      style={{ border: '2px solid black', padding: '20px 0px', width: '50%', margin: '1rem 3px', borderRadius: '20px', fontSize: '20px' }}
                      value={MatriculasEdicao[i] || ''}
                      required
                      onChange={(e) => HandleMatricula(i, e)}
                    />
                  );
            }
            setInputMatriculasEdicao(inputs)
        },[QuantidadeFuncionariosEdicao, HandleMatricula, MatriculasEdicao])

        const ExcluirOrdem = (ordem) => {
            const confirmação  = window.confirm('Tem certeza que deseja excluir esta Ordem de Produção ?')
            if(confirmação){
                const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
                var ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
                const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || [];
                const pausasIndexAtual = pausasLocalStorage.findIndex(element => element.id === ordem.id)
                if(ordemAtualIndex !== -1){
                    if(pausasIndexAtual !== -1){
                        pausasLocalStorage.splice(pausasIndexAtual, 1)
                        localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                    }
                ordensLocalStorage.splice(ordemAtualIndex, 1)
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                setLocalStorage(ordensLocalStorage)
                setModalEdicao(false)
                }else{
                    console.log('Não foi possivel encontrar o id desta ordem na localStorage.')
                }
            }
        }

         

    return(
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
        <Input placeholder="Numero da OP"   padding = "20px 0px" width="60%" margin ="1rem 0px" border_radius="20px" border='0.1px black solid' font_size="20px" value={NumeroOPEdicao} onChange={HandleNumeroOP} ></Input>
        <Label font_size = '26px'>Matricula do funcionario :</Label>
        <DivLinha>
            {  
                  InputMatriculasEdicao
            }
            
            <DivColuna style={{cursor:'pointer' , width:'10%'}} onClick={AdicaoFuncionario}>
             <Imagem src={imgAdicionarFuncionario} width='30%'/>
             <span style={{color:'black'}}>Adicionar Funcionario</span>
            </DivColuna>
            { QuantidadeFuncionariosEdicao > 1 || QuantidadeFuncionariosEdicao === '' ? 
            <DivColuna style={{cursor:'pointer' , width:'10%'}} onClick={RemoverFuncionario}>
            <Imagem src={imgRemoverFuncionario} width='30%'/>
            <span style={{color:'black'}}>Remover Funcionario</span>
           </DivColuna>
           : ''    
        }
                </DivLinha>
        <Label font_size = '26px'>Mesa :</Label>
             <Select margin='1rem 0' width='30%'  padding='10px' value={MesaEdicao} border='0.1px black solid' onChange={HandleMesa}>
                 <Option padding='10px 2px' fontSize='20px' value='' >Selecione Uma Mesa...</Option>
                {
                    mesas.map((mesa,index) => (
                        <Option key={index} padding='10px 2px' fontSize='20px' >{mesa}</Option>
                    ))
                }
                </Select>
                <Label font_size = '26px'>Turno :</Label>
                <Select margin='1rem 0' width='30%'  padding='10px' border='0.1px black solid' value={TurnoEdicao} onChange={HandleTurno}>
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
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() =>{ ExcluirOrdem(OrdemEditando)}   }>EXCLUIR</Botao>         
    </Modal>

    )
}

export default ModalEditar