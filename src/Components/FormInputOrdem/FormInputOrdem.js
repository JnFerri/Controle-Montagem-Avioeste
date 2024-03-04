import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2.js";
import Input from "../Input/Input.js";
import Botao from "../Botao/Botao.js";
import { useState } from "react";
import { OrdensController } from "../../Controller/OrdensController.js";
import Select from "../Select/Select.js";
import mesas from "../../BD/mesas.js";
import Option from "../Select/Option/Option.js";

const ordensController = new OrdensController()

const FormContainer = styled.form`
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    margin: 1rem 0;
`


function FormInputOP(){
    const [NumeroOP, setNumeroOP] = useState('')
    const [Matricula, setMatricula] = useState('')
    const [Mesa, setMesa] = useState('')
    async function CriaOrdemJestor(event){
        event.preventDefault()
        const obj ={}
        obj['ordem_producao'] = NumeroOP
        const dataInicio = new Date().toLocaleString()
        console.log(dataInicio)
        obj['hora_de_inicio'] = dataInicio
        obj['matricula'] = Matricula
        obj['mesa_teste'] = Mesa
        setNumeroOP('')
        setMatricula('')
        setMesa('')
        await ordensController.criarRegistro('fk0lbipncnh3mu7u95dls', obj)
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

    return(
        <FormContainer>
            <Titulo2 color="white">Coloque o numero da ordem de produção e clique em iniciar para começar uma nova ordem de produção</Titulo2>
            <Input placeholder="Numero da OP" padding = "20px 0px" width="80%" margin ="1rem 0px" borderRadius="20px" fontSize="20px" value={NumeroOP} 
                onChange={HandleNumeroOP} ></Input>
             <Input placeholder="Matricula Funcionario" padding = "20px 0px" width="30%" margin ="1rem 0px" borderRadius="20px" fontSize="20px" value={Matricula} 
                onChange={HandleMatricula} ></Input>
             <Select margin='1rem 0' width='30%' padding='10px' value={Mesa} onChange={HandleMesa}>
                 <Option padding='10px 2px' fontSize='20px' value='' >Selecione Uma Mesa...</Option>
                {
                    mesas.map(mesa => (
                        <Option padding='10px 2px' fontSize='20px' >{mesa}</Option>
                    ))
                }
                </Select>      
            <Botao width="30%" padding="20px 0px" borderRadius = "20px" margin="1rem 0" color="black" backgroundcolor='white' border="0.5px solid black" onClick={CriaOrdemJestor}>Iniciar OP</Botao>
        </FormContainer>
    )
}

export default FormInputOP