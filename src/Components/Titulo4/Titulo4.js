import styled from "styled-components";


const Titulo4 = styled.h2`
width:${props => props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
font-size: ${props => props.font_size || "14px"};
text-align: ${props => props.text_align || "center"};
color: ${props => props.color || "black"};
`

export default Titulo4