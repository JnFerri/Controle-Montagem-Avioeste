import styled from "styled-components";

/**
 * Componente Option customizável.
 * @component
 * @property {string} font_size Define o tamanho da fonte. Valor padrão : '16px'
 * @property {string} color Define a cor da fonte. 
 */
const Option = styled.option`
    font-size:${props => props.font_size || '16px'};
    color:${props => props.color || 'black'};
    
`

export default Option