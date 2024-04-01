import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2.js";
import Input from "../Input/Input.js";
import Botao from "../Botao/Botao.js";
import {  useState } from "react";
import Select from "../Select/Select.js";
import mesas from "../../BD/mesas.js";
import Option from "../Select/Option/Option.js";
//import { PegarOrdensNaoFinalizadas } from "../../Services/PegarOrdensNaoFinalizadas.js";
import tranformarDataEmString from "../../Helpers/tranformarDataEmString.js";
import Delay from "../../Helpers/Delay.js";
import { v4 as uuidv4 } from 'uuid'
import turnos from "../../BD/turnos.js";

const FormContainer = styled.form`
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    margin: 1rem 0;
`


function FormInputOP({setOrdens, ordens,LocalStorage,setLocalStorage}){
    

    const [NumeroOP, setNumeroOP] = useState('')
    const [Matricula, setMatricula] = useState('')
    const [Mesa, setMesa] = useState('')
    const [Turno, setTurno] = useState('')
    async function CriaOrdemJestor(event){
        
        const confereRepetido =await ordens.find(ordem => ordem.ordem_producao === NumeroOP)
        if(event.key === 'Enter'){
            event.preventDefault()
        }
        if(!confereRepetido){
            event.preventDefault()
            const dataInicio = tranformarDataEmString(new Date())
            if(!NumeroOP || !dataInicio || !Matricula || !Mesa || !Turno){
                window.alert("Preencha todos os campos antes de incluir a Ordem de Produção !!")
                throw Error('Formulario com campos vazios')
            }else{
                const obj ={}
                obj['ordem_producao'] = NumeroOP
                obj['horario_inicio'] = dataInicio
                obj['matricula'] = Matricula
                obj['mesa'] = Mesa
                obj['turno'] = Turno
                obj['status'] = 'Em Andamento'
                obj['id'] =uuidv4()
                setNumeroOP('')
                setMatricula('')
                setMesa('')
                setTurno('')
                const localStorageData = JSON.parse(localStorage.getItem('ordensNaoFinalizadas') || "[]");
                localStorageData.push(obj)
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(localStorageData))
                await Delay(1000)
                setLocalStorage(localStorageData)
                //await ordensController.criarRegistro('fk0lbipncnh3mu7u95dls', obj)
                //const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
                //setOrdens(ordensNaoFinalizadas)
            }
        }else{
            event.preventDefault()
            window.alert("Esta OP ja esta na lista")
            setNumeroOP('')
            setMatricula('')
            setMesa('')
            setTurno('')
        }
    }
    
    const HandleNumeroOP = (event) => {
        setNumeroOP(event.target.value);
        if(event.key === 'Enter'){
            event.preventDefault()
        }
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

    const HandlePrevineEnvio = (event) =>{
        if(event.key === 'Enter'){
            event.preventDefault()
        }
    }

    return(
        <FormContainer>
            <Titulo2 color="white">Coloque o numero da ordem de produção e clique em iniciar para começar uma nova ordem de produção</Titulo2>
            <Input placeholder="Numero da OP"  border='2px solid black'  padding = "20px 0px" width="80%" margin ="1rem 0px" border_radius="20px" font_size="20px" value={NumeroOP} 
                onChange={HandleNumeroOP} onKeyDown={HandlePrevineEnvio} ></Input>
             <Input placeholder="Matricula Funcionario" border='2px solid black' padding = "20px 0px" width="30%" margin ="1rem 0px" border_radius="20px" font_size="20px" value={Matricula} 
                onChange={HandleMatricula} ></Input>
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