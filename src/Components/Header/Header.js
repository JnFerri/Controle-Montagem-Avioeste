import styled from "styled-components"
import Imagem from "../Imagem/Imagem.js"
import Logo from "../../images/logo.png"
import Titulo1 from "../Titulo1/Titulo1.js"

/**
 * styled-component de header.
 */
const HeaderContainer = styled.header`
display:flex;
align-items:center;
justify-content:space-around;
padding: 5px 0;
background-color: white;
width:100%;

`
/**
 * styled-component de div que serve de container dos outros componentes.
 */
const HeaderBox = styled.div`
width:40%;
display:flex;
align-items:center;
`

/**
 * Componente simples de Header.
 * @returns {JSX.Element} Componente React Header
 */
function Header(){
    return(
        <HeaderContainer>
            <HeaderBox>
            <Imagem src={Logo} width='15%' margin = "2px 0px 0px 20px"></Imagem>
            <Titulo1 width = "100%" margin = "2px 0px" text_align = "center" font_size='30px' color="#004D70" text_shadow='1px 1px 2px black'><strong>CONTROLE PRODUÇÃO MONTAGEM</strong></Titulo1>
            </HeaderBox>
        </HeaderContainer>
    )
}

export default Header