import styled from "styled-components"
const Imagem = styled.img`
width: ${props=> props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
`

export default Imagem