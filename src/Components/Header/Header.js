import styled from "styled-components"
import Imagem from "../Imagem/Imagem.js"
import Logo from "../../images/logo.png"
import Titulo1 from "../Titulo1/Titulo1.js"

const HeaderContainer = styled.header`
display:flex;
align-items:center;
justify-content:space-between;
padding: 20px 0;
background-color: white;
width:100%;
`


function Header(){
    return(
        <HeaderContainer>
            <Imagem src={Logo} width='10%' margin = "5px 50px"></Imagem>
            <Titulo1 width = "100%" margin = "5px 20px" text_align = "center">Controle de Produção Montagem</Titulo1>
        </HeaderContainer>
    )
}

export default Header