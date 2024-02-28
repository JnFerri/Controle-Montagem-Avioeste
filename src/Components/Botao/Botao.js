import styled from "styled-components";

const Botao = styled.button`
    color: ${props=> props.color};
    background-color: ${props=> props.backgroundColor};
    border-radius: ${props=> props.borderRadius};
    width: ${props=> props.width};
    border: ${props=> props.border};
    padding: ${props=> props.padding};
    margin: ${props => props.margin}
`

export default Botao