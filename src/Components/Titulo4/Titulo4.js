import styled from "styled-components";

/**
 * Componente de titulo h4 customizável
 * @property {string} width Define o comprimento do elemento. Valor padrão '100%'
 * @property {string} margin Define o espaçamento externo do componentne. Valor padrão '0px 0px'
 * @property {string} font_size Define o tamanho da fonte. Valor padrão '14px'
 * @property {string} text_align Define o alinhamento do texto. Valor padrão 'center'
 * @property {string} color Define a cor do texto. Valor padrão 'black'
 * @property {string} backgroundcolor Define a cor do background do componente. Valor padrão ''.
 * @property {string} border_radius Define o angulo da curvatura dos cantos da borda do componente. Valor padrão '0px'
 */
const Titulo4 = styled.h4`
width:${props => props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
font-size: ${props => props.font_size || "14px"};
text-align: ${props => props.text_align || "center"};
color: ${props => props.color || "black"};
background-color: ${props => props.backgroundcolor || ""};
border-radius: ${props => props.border_radius || "0px"};
`

export default Titulo4