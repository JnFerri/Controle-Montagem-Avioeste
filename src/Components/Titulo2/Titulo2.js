import styled from "styled-components";


const Titulo2 = styled.h2`
width:${props => props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
font-size: ${props => props.fontSize || "32px"};
text-align: ${props => props.textAlign || "center"};
color: ${props => props.color || "black"};
`

export default Titulo2