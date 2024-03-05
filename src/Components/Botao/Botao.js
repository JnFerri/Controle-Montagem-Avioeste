import styled from "styled-components";

const Botao = styled.button`
    color: ${props=> props.color};
    background-color: ${props=> props.backgroundcolor || 'white'};
    border-radius: ${props=> props.borderRadius || '0px'};
    width: ${props=> props.width ||'100%'};
    border: ${props=> props.border || '0px'};
    padding: ${props=> props.padding || '0px 0px'};
    margin: ${props => props.margin || '0px 0px'};
    font-size: ${props => props.fontSize|| '14px'}
`

export default Botao