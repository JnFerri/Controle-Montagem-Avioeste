import styled from "styled-components"

/**
 * Componente Input customizavel.
 * @component
 * @property {string} width Define comprimento do componente. Valor padrão : '100%'
 * @property {string} padding Define o espaçamento interno do elemento. Valor padrão : '0px 0px'
 * @property {string} margin Define o expaçamento externo do elemento.Valor padrão : '0px 0px'
 * @property {string} border Define opções de borda.Valor padrão : '0px'
 * @property {string} border_radius Define o angulo da borda do canto do componente. Valor padrão : '0px'
 * @property {string} text_align Define o alinhamento do texto. Valor padrão 'center'
 * @property {string} font_size Define o tamanho da fonte. Valor padrão : '14px'
 * @exemple
 * 
 * <Input
 * 
 */
const Input = styled.input`
    width: ${props => props.width || "100%"};
    padding: ${props => props.padding || "0px 0px"};
    margin: ${props => props.margin || '0px 0px'};
    border: ${props => props.border || '0px'};
    border-radius: ${props => props.border_radius || '0px'};
    text-align:${props => props.text_align || "center"};
    font-size: ${props => props.font_size || '14px'}
`

export default Input