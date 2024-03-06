import styled from "styled-components";

const Botao = styled.button`
    color: ${props=> props.color};
    background-color: ${props=> props.backgroundcolor || 'white'};
    border-radius: ${props=> props.border_radius || '0px'};
    width: ${props=> props.width ||'100%'};
    border: ${props=> props.border || '0px'};
    padding: ${props=> props.padding || '0px 0px'};
    margin: ${props => props.margin || '0px 0px'};
    font-size: ${props => props.font_size|| '14px'};
    box-shadow : ${props => props.boxshadow || '0px 0px 0px'};
    cursor:pointer;
    transition: transform 0.2s;
    &:active {
        transform: translateY(2px);
      }
    &:hover {
        transform: scale(1.05);
    }
`

export default Botao