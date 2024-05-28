import styled from "styled-components";

/**
 * Componente simples de Label.
 * @component
 * @property {string} font_size Define o tamanho da fonte. Valor padrão : '16px'
 * @property {string} color Define a cor da fonte. Valor padrão : 'black'
 * @example
 * return (
 * <Label
 * font_size = '14px'
 * color = 'orange'
 * >
 * alguma coisa escrita aqui
 * </Label>
 * )
 */
const Label = styled.label`
    font-size : ${props => props.font_size || '16px'};
    color : ${props => props.color || 'black'};
`

export default Label