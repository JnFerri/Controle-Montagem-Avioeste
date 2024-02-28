import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2";
import Input from "../Input/Input";
import Botao from "../Botao/Botao";

const FormContainer = styled.form`
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    margin: 2rem 0;
`

function FormInputOP(){
    return(
        <FormContainer>
            <Titulo2 color="white">Coloque o numero da ordem de produção e clique em iniciar para começar uma nova ordem de produção</Titulo2>
            <Input placeholder="Numero da OP" padding = "20px 0px" width="80%" margin ="2rem 0px" borderRadius="20px" fontSize="20px"></Input>
            <Botao width="30%" padding="20px 0px" borderRadius = "20px" margin="2rem 0" color="black" backgroundColor="white" border="0.5px solid black">Iniciar OP</Botao>
        </FormContainer>
    )
}

export default FormInputOP