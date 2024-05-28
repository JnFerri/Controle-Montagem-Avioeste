import styled from "styled-components";

/**
 * Componente de Select customizável.
 * @component
 * @property {string} width Define o comprimento do componente. Valor padrão : '100%'
 * @property {string} margin Define o espaçamento externo do componente. Valor padrão : '0px 0px'
 * @property {string} padding Define o espaçamento interno do componente. Valor padrão : '0px 0px'
 * @property {string} font_size Define o tamanho da fonte. Valor padrão : '16px'
 */
const Select = styled.select`
    width:${props=> props.width || '100%'};
    margin:${props=>props.margin || '0px 0px'};
    padding:${props => props.padding || '0px 0px'};
    font-size:${props => props.font_size || '16px'};
`

export default Select