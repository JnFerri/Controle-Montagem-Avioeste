import styled from "styled-components";

/**
 * Componente de titulo h2 customizável
 * @property {string} width Define o comprimento do componente. Valor padrão '100%'
 * @property {string} margin Define o espaçamento externo do componente. Valor padrão '0px 0px'
 * @property {string} font_size Define o tamanho da fonte. Valor padrão '32px'
 * @property {string} text_align Define o alinhamento do texto. Valor padrão 'center'
 * @property {string} color Define a cor da fonte. Valor padrão 'black'
 */
const Titulo2 = styled.h2`
width:${props => props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
font-size: ${props => props.font_size || "32px"};
text-align: ${props => props.text_align || "center"};
color: ${props => props.color || "black"};
`

export default Titulo2