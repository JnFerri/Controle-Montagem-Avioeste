import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2.js";
import Input from "../Input/Input.js";
import Botao from "../Botao/Botao.js";
import {  useCallback, useEffect, useState } from "react";
import Select from "../Select/Select.js";
import mesas from "../../BD/mesas.js";
import Option from "../Select/Option/Option.js";
//import { PegarOrdensNaoFinalizadas } from "../../Services/PegarOrdensNaoFinalizadas.js";
import tranformarDataEmString from "../../Helpers/tranformarDataEmString.js";
import Delay from "../../Helpers/Delay.js";
import { v4 as uuidv4 } from 'uuid'
import turnos from "../../BD/turnos.js";
import imgAdicionarFuncionario from '../../images/adicionar-usuario.png'
import imgRemoverFuncionario from '../../images/remover-usuario.png'
import Imagem from "../Imagem/Imagem.js"

/**
 * styled-component simples de formulario.
 */
const FormContainer = styled.form`
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    margin: 1rem 0;
`

/**
 * styled-component para deixar itens alinhados em linha na horizontal.
 */
const DivLinha = styled.div`
    display:flex;
    align-items:center;
    width:70%;
    justify-content:center;

`
/**
 * styled-component para deixar itens alinhados em coluna na vertical.
 */
const DivColuna = styled.div`
    display:flex;
    align-items:center;
    flex-direction:column;
    margin:0px 5px;
`
/**
 * Estado que guarda o valor do input de numero de ordem de produção do formulario.
 * @typedef {EstadoReact} NumeroOP
 * @property {string} NumeroOP Valor do input de numero de ordem de produção.
 * @property {React.Dispatch<React.SetStateAction<string>>} setNumeroOP Funcão que define novo valor para o estado NumeroOP.
 */

/**
 * Estado que guarda as matriculas dos funcionarios adicionadas aos inputs do formulario.
 * @typedef {EstadoReact} Matriculas
 * @property {Array<string>} Matriculas Array com as matriculas dos funcionarios.
 * @property {React.Dispatch<React.SetStateAction<Array<string>>>} setMatriculas Função que define novo valor para o estado Matriculas.
 */

/**
 * Estado que guarda o valor selecionado de mesa no formulario.
 * @typedef {EstadoReact} Mesa
 * @property {string} Mesa Valor do select de mesa.
 * @property {React.Dispatch<React.SetStateAction<string>>} setMesa Função que define novo valor para o estado Mesa.
 */

/**
 * Estado que guarda o valor selecionado de turno no formulario.
 * @typedef {EstadoReact} Turno
 * @property {string} Turno Valor do select de turno.
 * @property {react.Dispatch<React.SetStateAction<string>>} setTurno Função que define novo valor para o estado Turno.
 */

/**
 * Estado que guarda a quantidade de matriculas adicionadas no formulario.
 * @typedef {EstadoReact} QuantidadeFuncionario
 * @property {number} QuantidadeFuncionario Quantidade de matriculas adicionadas ao formulario.
 * @property {react.Dispatch<React.SetStateAction<number>>} setQuantidadeFuncionario Função que define novo valor para o estado Turno.
 */

/**
 * Estado que guarda um array com os componentes de inputs de matriculas. Utilizado pois o numero de inputs é variavel conforme quantidade de funcionarios adicionados a ordem.
 * @typedef {EstadoReact} InputsMatricula
 * @property {Array} InputsMatricula Array de componentes input para capturar a matricula do funcionario.
 * @property {react.Dispatch<React.SetStateAction<Array>>} setInputMatricula Função que define novo valor para InputsMatricula.
 */

/**
 * Componente de formulario utilizado para cadastrar novas ordens de produção e salvar seus dados no localStorage de ordensNaoFinalizadas, altera o valor do estado LocalStorage com o valor de ordensNaoFinalizadas da localstorage e consequentemente alterando o estado LocalStorage o estado Ordens será atualizado adicionando mais um item a lista de ordens.
 * @param {Object} props props do componente react
 * @param {Array} props.ordens Estado 'Ordens' proveniente do componente ControleProdução , um array com os dados das ordens que estão na lista de ordens não finalizadas.
 * @param {React.Dispatch<React.SetStateAction<Array>>} props.setLocalStorage Função que define o estado LocalStorage.
 * @returns {JSXElement}
 */
function FormInputOP({ ordens,setLocalStorage}){

    /**
     * Estado que armazena valor do input de numero de ordem de produção.
     */
    const [NumeroOP, setNumeroOP] = useState('')

    /**
     * Estado que armazena array contendo o valor dos inputs de matriculas dos funcionarios.
     */
    const [Matriculas, setMatriculas] = useState([])

    /**
     * Estado que armazena o valor do input de mesa de produção.
     */
    const [Mesa, setMesa] = useState('')

    /**
     * Estado que armazena o valor do input de turno.
     */
    const [Turno, setTurno] = useState('')

    /**
     * Estado que armazena a quantidade de matriculas adicionados ao formulario.
     */
    const [QuantidadeFuncionario, setQuantidadeFuncionario] = useState(1)

    /**
     * Estado que guarda um Array dos componentes de Input de matricula.
     */
    const [InputsMatricula, setInputMatricula] = useState([])


    /**
     * Pega os dados coletados, salvos nos estados pelos inputs e salva na localStorage 'ordensNaoFinalizadas', altera o valor do estado LocalStorage com o novo valor do localstorage, ao atualizar LocalStorage consequentemente altera o valor de ordens com os mesmos valores de LocalStorage atualizando a visualização da lista.
     * @param {Event} event Evento de submit do formulario.
     */
    async function CriaOrdemJestor(event){
        
        const confereRepetido =await ordens.find(ordem => ordem.ordem_producao === NumeroOP)

        //Bloqueia envio quando lido com o leitor de código de barras.
        if(event.key === 'Enter'){
            event.preventDefault()
        }

        if(!confereRepetido){
            event.preventDefault()
            const dataInicio = tranformarDataEmString(new Date())
            if(!NumeroOP || !dataInicio || !Matriculas[0] || !Mesa || !Turno || Matriculas.length !== QuantidadeFuncionario){
                window.alert("Preencha todos os campos antes de incluir a Ordem de Produção !!")
            }else if(NumeroOP.length < 7 || NumeroOP.length > 7){
                window.alert("Quantidade digitos do numero da OP estão fora do normal, Verifique se esta correto !!!")
            }else if (Matriculas[0].length < 1 || Matriculas[0].length > 6 ){
                window.alert('Quantidade de Digitos de matricula de Funcionario Fora do Normal, Verifique, caso necessario adicionar mais de uma matricula utilize o botão "Adicionar Funcionario".')
            }
            else{
                
                const obj ={}
                obj['ordem_producao'] = NumeroOP
                obj['horario_inicio'] = dataInicio
                obj['matricula'] = Matriculas[0]
                obj['matricula_2'] = Matriculas[1]
                obj['matricula_3'] = Matriculas[2]
                obj['matricula_4'] = Matriculas[3]
                obj['quantidade_funcionarios'] = QuantidadeFuncionario
                obj['matriculas'] = Matriculas
                obj['mesa'] = Mesa
                obj['turno'] = Turno
                obj['status'] = 'Em Andamento'
                obj['id'] = uuidv4()
                
                setNumeroOP('')
                setMatriculas([])
                setMesa('')
                setTurno('')
                setQuantidadeFuncionario(1)
                const localStorageData = JSON.parse(localStorage.getItem('ordensNaoFinalizadas') || "[]");
                localStorageData.push(obj)
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(localStorageData))
                await Delay(1000)
                setLocalStorage(localStorageData)
            }
        }else{
            event.preventDefault()
            window.alert("Esta OP ja esta na lista")
            setNumeroOP('')
            setMatriculas([])
            setMesa('')
            setTurno('')
        }
    }
    
    /**
     * Define o estado NumeroOP com o valor do input de ordem de produção.
     * @param {*} event  Evento onChange do input.
     */
    const HandleNumeroOP = (event) => {
        //Previne enviar o formulario quando lido numero da op com leitor de código de barras.
        if(event.key === 'Enter'){
            event.preventDefault()
        }
            setNumeroOP(event.target.value);
        }
        
       /**
        * Define o estado Matriculas, adicionando o valor conforme input.
        */
    const HandleMatricula = useCallback((index, event) => {
            const newMatriculas = [...Matriculas];
            newMatriculas[index] = event.target.value;
            setMatriculas(newMatriculas);
      }, [Matriculas]);
    
      /**
       * Define o estado Mesa conforme valor do input.
       * @param {*} event Evento onChange do input. 
       */
    const HandleMesa = (event) => {
        setMesa(event.target.value);
    };

    /**
     * Define o estado Turno conforme valor do input.
     * @param {*} event Evento onChange do input.
     */
    const HandleTurno = (event) => {
        setTurno(event.target.value);
    };

    /**
     * Previne submit do formulario quando lido o numero da ordem de produção com leitor de código de barras.
     * @param {*} event Evento onKeyDown.
     */
    const HandlePrevineEnvio = (event) =>{
        if(event.key === 'Enter'){
            event.preventDefault()
        }
    }

    /**
     * Altera valor do estado QuantidadeFuncionario adicionando +1 se este for menor que 4.
     */
    const AdicaoFuncionario = () => {
        if(QuantidadeFuncionario < 4){
            const novoValor = QuantidadeFuncionario + 1
            setQuantidadeFuncionario(novoValor)
        }else{
            window.alert('Maximo 4 Funcionarios por OP')
        }
    }

    /**
     * Altera valor do estado QuantidadeFuncionario subtraindo -1 .
     */
    const RemoverFuncionario = () => {
        const novoValor = QuantidadeFuncionario - 1
        setQuantidadeFuncionario(novoValor)
    }

    /**
     * Define a quantidade de componentes input que estão no estado InputMatricula conforme valor de estado QuantidadeFuncionario.
     */
    useEffect(() => {
        
        const inputs = []
        for(let i = 0;i < QuantidadeFuncionario; i++){
            inputs.push(
                <Input
                  key={i}
                  placeholder="Matrícula do Funcionário"
                  style={{ border: '2px solid black', padding: '20px 0px', width: '70%', margin: '1rem 3px', borderRadius: '20px', fontSize: '20px' }}
                  value={Matriculas[i] || ''}
                  required
                  onChange={(e) => HandleMatricula(i, e)}
                />
              );
        }
        setInputMatricula(inputs)
    },[QuantidadeFuncionario, HandleMatricula, Matriculas])

    return(
        <FormContainer>
            <Titulo2 color="white">Coloque o numero da ordem de produção e clique em iniciar para começar uma nova ordem de produção</Titulo2>
             <Input placeholder="Numero da OP"  border='2px solid black'  padding = "20px 0px" width="80%" margin ="1rem 0px" border_radius="20px" font_size="20px" value={NumeroOP} 
                onChange={HandleNumeroOP} onKeyDown={HandlePrevineEnvio}></Input>
                <DivLinha>
            {  
                   InputsMatricula
            }
            
            <DivColuna style={{cursor:'pointer' , width:'10%'}} onClick={AdicaoFuncionario}>
             <Imagem src={imgAdicionarFuncionario} width='30%'/>
             <span style={{color:'white'}}>Adicionar Funcionario</span>
            </DivColuna>
            {QuantidadeFuncionario > 1 ? 
            <DivColuna style={{cursor:'pointer' , width:'10%'}} onClick={RemoverFuncionario}>
            <Imagem src={imgRemoverFuncionario} width='30%'/>
            <span style={{color:'white'}}>Remover Funcionario</span>
           </DivColuna>
           : ''    
        }
                </DivLinha>
             <Select margin='1rem 0' width='30%'   padding='10px' value={Mesa} onChange={HandleMesa}>
                 <Option padding='10px 2px' fontSize='20px' value='' >Selecione Uma Mesa...</Option>
                {
                    mesas.map((mesa,index) => (
                        <Option key={index} padding='10px 2px' fontSize='20px' >{mesa}</Option>
                    ))
                }
                </Select>
                <Select margin='1rem 0' width='30%'  padding='10px' value={Turno} onChange={HandleTurno}>
                <Option padding='10px 2px' fontSize='20px' value='' >Selecione Um Turno...</Option>
                {
                    turnos.map((turno,index) =>(
                        <Option key={index} padding='10px 2px' fontSize='20px' >{turno}</Option>
                    ))
                }
                    
                    </Select>      
            <Botao width="30%" boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding="20px 0px" border_radius = "10px" margin="1rem 0" color="black" backgroundcolor='#79b3e0' font_size='25px' border='2px solid black' onClick={CriaOrdemJestor}>INICIAR ORDEM DE PRODUÇÃO</Botao>
        </FormContainer>
    )
}

export default FormInputOP