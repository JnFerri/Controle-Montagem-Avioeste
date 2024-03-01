import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2.js";
import Input from "../Input/Input.js";
import Botao from "../Botao/Botao.js";
import { useState } from "react";
import { OrdensController } from "../../Controller/OrdensController.js";

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
    
    
   async function CriaOrdemJestor(event){
        event.preventDefault()
        const obj ={}
        obj['ordem_producao'] = NumeroOP
        const novoDado = await ordensController.criarRegistro('fk0lbipncnh3mu7u95dls', obj)
        console.log(novoDado)
    }
    
    const handleInputChange = (event) => {
        setNumeroOP(event.target.value);
    };
    return(
        <FormContainer>
            <Titulo2 color="white">Coloque o numero da ordem de produção e clique em iniciar para começar uma nova ordem de produção</Titulo2>
            <Input placeholder="Numero da OP" padding = "20px 0px" width="80%" margin ="1rem 0px" borderRadius="20px" fontSize="20px" value={NumeroOP} 
                onChange={handleInputChange} ></Input>
            <Botao width="30%" padding="20px 0px" borderRadius = "20px" margin="1rem 0" color="black" backgroundcolor='white' border="0.5px solid black" onClick={CriaOrdemJestor}>Iniciar OP</Botao>
        </FormContainer>
    )
}

export default FormInputOP