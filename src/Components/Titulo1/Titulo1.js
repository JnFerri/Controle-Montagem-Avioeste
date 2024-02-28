import styled from "styled-components";


const Titulo1 = styled.h1`
width:${props => props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
font-size: ${props => props.fontSize || "42px"};
text-align: ${props => props.textAlign || "center"};
color: ${props => props.color || "black"};

`

export default Titulo1