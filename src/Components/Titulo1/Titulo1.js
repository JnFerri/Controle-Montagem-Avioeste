import styled from "styled-components";

/**
 * Componente de titulo h1 customizável
 * @property {string} width Define o comprimento do componente. Valor padrão : '100%'
 * @property {string} margin Define espaçamento externo do componente. Valor padrão : '0px 0px' 
 * @property {string} font_size Define o tamanho da fonte. Valor padrão : '42px'
 * @property {string} text_align Define alinhamento do texto. Valor padrão : 'center'
 * @property {string} color Define a cor da fonte. Valor padrão : 'black'
 * @property {string} text_shadow Define a sombra do texto.Valor padrão '0px 0px 0px'
  */
const Titulo1 = styled.h1`
width:${props => props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
font-size: ${props => props.font_size || "42px"};
text-align: ${props => props.text_align || "center"};
color: ${props => props.color || "black"};
text-shadow: ${props => props.text_shadow || "0px 0px 0px"};

`

export default Titulo1